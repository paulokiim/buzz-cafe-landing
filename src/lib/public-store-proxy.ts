const PRODUCTION_UPSTREAM_ORIGIN = "https://buzz-cafe-pdv.p12ulokr.chatgpt.site";
const PUBLIC_ORIGIN = "https://buzzcafe.com.br";
const UPSTREAM_TIMEOUT_MS = 30_000;
const STOREFRONT_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://www.facebook.com",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https://www.facebook.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
].join("; ");

type Fetcher = (request: Request) => Promise<Response>;
type ProxyMode = "html" | "passthrough";
type ProxyPrefix = "/api/public" | "/loja" | "/loja-assets" | "/media";

type ProxyOptions = {
  fetcher?: Fetcher;
  mode: ProxyMode;
  upstreamOrigin?: string;
};

const FORWARDED_REQUEST_HEADERS = new Set([
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "idempotency-key",
  "if-modified-since",
  "if-none-match",
  "origin",
  "range",
  "user-agent",
]);

const FORWARDED_RESPONSE_HEADERS = new Set([
  "accept-ranges",
  "cache-control",
  "content-disposition",
  "content-range",
  "content-security-policy",
  "content-type",
  "etag",
  "last-modified",
  "permissions-policy",
  "referrer-policy",
  "vary",
  "x-frame-options",
]);

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function validatedUpstreamOrigin(sourceUrl: URL, value: string) {
  const upstream = new URL(value);
  const productionUpstream = upstream.origin === PRODUCTION_UPSTREAM_ORIGIN;
  const localHttp = sourceUrl.protocol === "http:"
    && isLocalHost(sourceUrl.hostname)
    && upstream.protocol === "http:"
    && isLocalHost(upstream.hostname);

  if (
    upstream.username
    || upstream.password
    || upstream.pathname !== "/"
    || upstream.search
    || upstream.hash
    || (!productionUpstream && !localHttp)
  ) {
    throw new Error("Origem da loja pública inválida.");
  }

  return upstream.origin;
}

function upstreamOrigin(request: Request, override?: string) {
  const sourceUrl = new URL(request.url);
  const configured = override
    ?? process.env.PDV_PUBLIC_UPSTREAM_ORIGIN?.trim()
    ?? (isLocalHost(sourceUrl.hostname)
      ? "http://localhost:3004"
      : PRODUCTION_UPSTREAM_ORIGIN);
  return validatedUpstreamOrigin(sourceUrl, configured);
}

function requestHeaders(request: Request, sourceUrl: URL) {
  const headers = new Headers();
  for (const [name, value] of request.headers) {
    if (FORWARDED_REQUEST_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }

  const clientIp = request.headers.get("cf-connecting-ip")?.trim();
  if (clientIp) {
    headers.set("cf-connecting-ip", clientIp);
    headers.set("x-real-ip", clientIp);
  }
  headers.set("x-forwarded-host", sourceUrl.host);
  headers.set("x-forwarded-proto", sourceUrl.protocol.slice(0, -1));
  headers.set("x-buzz-public-route", "1");
  const proxySecret = process.env.PUBLIC_PROXY_SECRET?.trim();
  if (proxySecret) headers.set("x-buzz-proxy-secret", proxySecret);
  return headers;
}

function responseHeaders(response: Response, request: Request, mode: ProxyMode) {
  const headers = new Headers();
  for (const [name, value] of response.headers) {
    if (FORWARDED_RESPONSE_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }
  if (request.headers.has("authorization")) {
    headers.set("cache-control", "private, no-store");
    appendVary(headers, "Authorization");
  }
  if (mode === "html") {
    if (!headers.has("content-security-policy")) {
      headers.set("content-security-policy", STOREFRONT_CSP);
    }
    if (!headers.has("x-frame-options")) headers.set("x-frame-options", "DENY");
  }
  headers.set("x-content-type-options", "nosniff");
  return headers;
}

function appendVary(headers: Headers, value: string) {
  const entries = (headers.get("vary") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (!entries.some((entry) => entry.toLowerCase() === value.toLowerCase())) {
    entries.push(value);
  }
  headers.set("vary", entries.join(", "));
}

function rewriteLocation(
  headers: Headers,
  response: Response,
  upstream: string,
  sourceUrl: URL,
) {
  const location = response.headers.get("location");
  if (!location) return;
  const resolved = new URL(location, upstream);
  if (resolved.origin !== upstream) return;
  const publicUrl = new URL(resolved.pathname + resolved.search, sourceUrl.origin);
  if (publicUrl.pathname === "/loja/loja-inicial") publicUrl.pathname = "/loja";
  headers.set("location", publicUrl.toString());
}

function proxyFailure(mode: ProxyMode) {
  const headers = {
    "cache-control": "no-store",
    "content-type": mode === "html"
      ? "text/plain; charset=utf-8"
      : "application/json; charset=utf-8",
  };
  const body = mode === "html"
    ? "A loja está temporariamente indisponível. Tente novamente em instantes."
    : JSON.stringify({ error: "A loja está temporariamente indisponível." });
  return new Response(body, { headers, status: 502 });
}

function publicMutationFailure(status: 400 | 403 | 415, error: string) {
  return Response.json(
    { error },
    {
      headers: { "cache-control": "no-store" },
      status,
    },
  );
}

function validPublicMutationRequest(request: Request, sourceUrl: URL, upstreamPath: string) {
  if (request.method !== "POST") return undefined;

  const origin = request.headers.get("origin");
  if (!origin || origin !== sourceUrl.origin) {
    return publicMutationFailure(403, "Origem da solicitação inválida.");
  }

  const contentType = request.headers.get("content-type")?.toLowerCase().trim() ?? "";
  if (!/^application\/json(?:\s*;|$)/.test(contentType)) {
    return publicMutationFailure(415, "O conteúdo da solicitação deve ser JSON.");
  }

  if (
    /^\/api\/public\/stores\/[^/]+\/checkouts$/.test(upstreamPath)
    && !request.headers.get("idempotency-key")?.trim()
  ) {
    return publicMutationFailure(400, "A chave de idempotência é obrigatória.");
  }

  return undefined;
}

export function publicProxyPath(prefix: ProxyPrefix, segments: string[]) {
  const encoded = segments.map((segment) => {
    if (
      !segment
      || segment === "."
      || segment === ".."
      || segment.includes("/")
      || segment.includes("\\")
      || segment.length > 200
    ) {
      throw new Error("Caminho público inválido.");
    }
    return encodeURIComponent(segment);
  });
  return encoded.length ? `${prefix}/${encoded.join("/")}` : prefix;
}

export async function proxyPublicStoreRequest(
  request: Request,
  upstreamPath: string,
  options: ProxyOptions,
) {
  const sourceUrl = new URL(request.url);
  const invalidMutationResponse = validPublicMutationRequest(request, sourceUrl, upstreamPath);
  if (invalidMutationResponse) return invalidMutationResponse;

  let upstream: string;
  try {
    upstream = upstreamOrigin(request, options.upstreamOrigin);
  } catch {
    return proxyFailure(options.mode);
  }

  const targetUrl = new URL(upstreamPath, upstream);
  targetUrl.search = sourceUrl.search;
  const headers = requestHeaders(request, sourceUrl);
  const timeoutSignal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const signal = AbortSignal.any([request.signal, timeoutSignal]);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const requestInit: RequestInit & { duplex?: "half" } = {
    headers,
    method: request.method,
    redirect: "manual",
    signal,
  };
  if (hasBody) {
    requestInit.body = request.body;
    requestInit.duplex = "half";
  }
  const upstreamRequest = new Request(targetUrl, requestInit);

  try {
    const fetcher = options.fetcher ?? fetch;
    const upstreamResponse = await fetcher(upstreamRequest);
    const headers = responseHeaders(upstreamResponse, request, options.mode);
    rewriteLocation(headers, upstreamResponse, upstream, sourceUrl);

    return new Response(request.method === "HEAD" ? null : upstreamResponse.body, {
      headers,
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
    });
  } catch {
    return proxyFailure(options.mode);
  }
}

export const PUBLIC_STORE_ORIGIN = PUBLIC_ORIGIN;
