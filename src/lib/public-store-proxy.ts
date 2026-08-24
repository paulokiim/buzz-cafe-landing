const PRODUCTION_UPSTREAM_ORIGIN = "https://buzz-cafe-pdv.p12ulokr.chatgpt.site";
const PUBLIC_ORIGIN = "https://www.buzzcafe.com.br";
const UPSTREAM_TIMEOUT_MS = 30_000;
const STOREFRONT_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://api-pdv.buzzcafe.com.br https://www.facebook.com",
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
type ProxyPrefix = "/loja" | "/loja-assets" | "/media" | "/menu";

type ProxyOptions = {
  fetcher?: Fetcher;
  mode: ProxyMode;
  upstreamOrigin?: string;
};

const REQUEST_HEADERS = new Set(["accept", "accept-language", "if-modified-since", "if-none-match", "range", "user-agent"]);
const RESPONSE_HEADERS = new Set(["accept-ranges", "cache-control", "content-disposition", "content-range", "content-security-policy", "content-type", "etag", "last-modified", "permissions-policy", "referrer-policy", "vary", "x-frame-options"]);

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function upstreamOrigin(request: Request, override?: string) {
  const source = new URL(request.url);
  const configured = process.env.PDV_PUBLIC_UPSTREAM_ORIGIN?.trim();
  const value = override ?? configured ?? PRODUCTION_UPSTREAM_ORIGIN;
  const upstream = new URL(value);
  const production = upstream.origin === PRODUCTION_UPSTREAM_ORIGIN;
  const local = process.env.NODE_ENV !== "production"
    && source.protocol === "http:" && isLocalHost(source.hostname)
    && upstream.protocol === "http:" && isLocalHost(upstream.hostname);
  if (upstream.username || upstream.password || upstream.pathname !== "/" || upstream.search || upstream.hash || (!production && !local)) {
    throw new Error("Origem da loja pública inválida.");
  }
  return upstream.origin;
}

function requestHeaders(request: Request, source: URL) {
  const headers = new Headers();
  for (const [name, value] of request.headers) {
    if (REQUEST_HEADERS.has(name.toLowerCase())) headers.set(name, value);
  }
  headers.set("x-forwarded-host", source.host);
  headers.set("x-forwarded-proto", source.protocol.slice(0, -1));
  headers.set("x-buzz-public-route", "1");
  return headers;
}

function responseHeaders(response: Response, mode: ProxyMode) {
  const headers = new Headers();
  for (const [name, value] of response.headers) {
    if (RESPONSE_HEADERS.has(name.toLowerCase())) headers.set(name, value);
  }
  if (mode === "html") {
    if (!headers.has("content-security-policy")) headers.set("content-security-policy", STOREFRONT_CSP);
    if (!headers.has("x-frame-options")) headers.set("x-frame-options", "DENY");
  }
  headers.set("x-content-type-options", "nosniff");
  return headers;
}

function failure(mode: ProxyMode) {
  return new Response(
    mode === "html" ? "A loja está temporariamente indisponível. Tente novamente em instantes." : "Recurso indisponível.",
    { headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" }, status: 502 },
  );
}

export function canonicalStorefrontRequest(request: Request) {
  const source = new URL(request.url);
  if (isLocalHost(source.hostname) || source.hostname === "www.buzzcafe.com.br") return null;
  if (source.hostname !== "buzzcafe.com.br") return new Response("Host inválido.", { status: 400 });
  const target = new URL(source.pathname + source.search, PUBLIC_ORIGIN);
  return Response.redirect(target, 308);
}

export function publicProxyPath(prefix: ProxyPrefix, segments: string[]) {
  const encoded = segments.map((segment) => {
    if (!segment || segment === "." || segment === ".." || segment.includes("/") || segment.includes("\\") || segment.length > 200) {
      throw new Error("Caminho público inválido.");
    }
    return encodeURIComponent(segment);
  });
  return encoded.length ? `${prefix}/${encoded.join("/")}` : prefix;
}

export async function proxyPublicStoreRequest(request: Request, upstreamPath: string, options: ProxyOptions) {
  let upstream: string;
  try {
    upstream = upstreamOrigin(request, options.upstreamOrigin);
  } catch {
    return failure(options.mode);
  }
  const source = new URL(request.url);
  const target = new URL(upstreamPath, upstream);
  target.search = source.search;
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]);
  try {
    const response = await (options.fetcher ?? fetch)(new Request(target, {
      headers: requestHeaders(request, source),
      method: request.method,
      redirect: "manual",
      signal,
    }));
    const headers = responseHeaders(response, options.mode);
    const location = response.headers.get("location");
    if (location) {
      const resolved = new URL(location, upstream);
      if (resolved.origin === upstream) {
        const publicLocation = new URL(resolved.pathname + resolved.search, source.origin);
        if (publicLocation.pathname === "/loja/loja-inicial") publicLocation.pathname = "/loja";
        headers.set("location", publicLocation.toString());
      }
    }
    return new Response(request.method === "HEAD" ? null : response.body, { headers, status: response.status, statusText: response.statusText });
  } catch {
    return failure(options.mode);
  }
}

export const PUBLIC_STORE_ORIGIN = PUBLIC_ORIGIN;
