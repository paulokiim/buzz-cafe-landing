export const ASSET_BASE_PATH = "/pedir-assets" as const;

export const CHANNEL_KEYS = ["ifood", "keeta", "99food"] as const;
export const ORDER_COUPON = "BUZZ10" as const;

export type ChannelKey = (typeof CHANNEL_KEYS)[number];

export type TrackingEventName =
  | "PageView"
  | "Clique_iFood"
  | "Clique_Keeta"
  | "Clique_99Food";

export type TrackingSource = "next" | "prototype";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ChannelConfig = {
  key: ChannelKey;
  name: string;
  title: string;
  description: string;
  coupon: string;
  eventName: TrackingEventName;
  actionLabel: string;
  heroActionLabel?: string;
  mobileLabel: string;
  href: string;
  logo: ImageAsset;
  buttonLogo: ImageAsset;
  mobileLogo: ImageAsset;
  cardClassName: string;
  actionClassName: string;
  featured: boolean;
};

export type HeroSlide = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  image: ImageAsset;
  imagePosition: string;
};

export const fallbackChannelLinks = {
  ifood: "https://www.ifood.com.br/busca?q=buzz%20caf%C3%A9",
  keeta: "https://www.keeta-global.com/BR/pt-BR",
  "99food": "https://99app.com/99food/",
} satisfies Record<ChannelKey, string>;

function normalizeExternalUrl(url: string | undefined): string | undefined {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

const channelLinks = {
  ifood:
    normalizeExternalUrl(
      process.env.IFOOD_LINK ?? process.env.NEXT_PUBLIC_BUZZ_IFOOD_URL
    ) ?? fallbackChannelLinks.ifood,
  keeta:
    normalizeExternalUrl(
      process.env.KEETA_LINK ?? process.env.NEXT_PUBLIC_BUZZ_KEETA_URL
    ) ?? fallbackChannelLinks.keeta,
  "99food":
    normalizeExternalUrl(
      process.env["NINE_NINE_FOOD_LINK"] ??
      process.env.NEXT_PUBLIC_BUZZ_99FOOD_URL
    ) ?? fallbackChannelLinks["99food"],
} satisfies Record<ChannelKey, string>;

export const channels = [
  {
    key: "ifood",
    name: "iFood",
    title: "Usar BUZZ10 no iFood",
    description:
      "Aplique o cupom BUZZ10 antes de finalizar seu café, croissant ou combo pelo app.",
    coupon: ORDER_COUPON,
    eventName: "Clique_iFood",
    actionLabel: "Abrir iFood",
    heroActionLabel: "Pedir no iFood",
    mobileLabel: "iFood",
    href: channelLinks.ifood,
    logo: {
      src: `${ASSET_BASE_PATH}/ifood-logo-red.svg`,
      alt: "iFood",
      width: 122,
      height: 46,
    },
    buttonLogo: {
      src: `${ASSET_BASE_PATH}/ifood-logo-white.svg`,
      alt: "",
      width: 78,
      height: 21,
    },
    mobileLogo: {
      src: `${ASSET_BASE_PATH}/ifood-logo-white.svg`,
      alt: "",
      width: 78,
      height: 21,
    },
    cardClassName:
      "border-[rgba(215,25,40,0.32)] shadow-[0_18px_44px_rgba(215,25,40,0.1)]",
    actionClassName:
      "bg-[var(--buzz-ifood)] text-white hover:bg-[color-mix(in_oklch,var(--buzz-ifood),black_10%)]",
    featured: true,
  },
  {
    key: "keeta",
    name: "Keeta",
    title: "Usar BUZZ10 no Keeta",
    description:
      "Use o mesmo cupom BUZZ10 no Keeta e finalize o pedido na plataforma.",
    coupon: ORDER_COUPON,
    eventName: "Clique_Keeta",
    actionLabel: "Abrir Keeta",
    heroActionLabel: "Pedir no Keeta",
    mobileLabel: "Keeta",
    href: channelLinks.keeta,
    logo: {
      src: `${ASSET_BASE_PATH}/platform-keeta-icon.webp`,
      alt: "Keeta",
      width: 48,
      height: 48,
    },
    buttonLogo: {
      src: `${ASSET_BASE_PATH}/platform-keeta-icon.webp`,
      alt: "",
      width: 24,
      height: 24,
    },
    mobileLogo: {
      src: `${ASSET_BASE_PATH}/platform-keeta-icon.webp`,
      alt: "",
      width: 34,
      height: 34,
    },
    cardClassName: "",
    actionClassName:
      "bg-[var(--buzz-keeta)] text-white hover:bg-[color-mix(in_oklch,var(--buzz-keeta),black_10%)]",
    featured: false,
  },
  {
    key: "99food",
    name: "99 Food",
    title: "Usar BUZZ10 no 99 Food",
    description:
      "Aplique o cupom BUZZ10 no 99 Food antes de finalizar seu pedido.",
    coupon: ORDER_COUPON,
    eventName: "Clique_99Food",
    actionLabel: "Abrir 99 Food",
    heroActionLabel: "Pedir no 99",
    mobileLabel: "99",
    href: channelLinks["99food"],
    logo: {
      src: `${ASSET_BASE_PATH}/99-food-logo.jpg`,
      alt: "99 Food",
      width: 54,
      height: 54,
    },
    buttonLogo: {
      src: `${ASSET_BASE_PATH}/99-food-logo.jpg`,
      alt: "",
      width: 38,
      height: 38,
    },
    mobileLogo: {
      src: `${ASSET_BASE_PATH}/99-food-logo.jpg`,
      alt: "",
      width: 34,
      height: 34,
    },
    cardClassName: "",
    actionClassName:
      "bg-[var(--buzz-99food)] text-[var(--buzz-ink)] hover:bg-[color-mix(in_oklch,var(--buzz-99food),white_16%)]",
    featured: false,
  },
] as const satisfies readonly ChannelConfig[];

export const heroActions = [channels[0], channels[1], channels[2]] as const;

export const heroProofPoints = [
  "Café da manhã e brunch",
  "Rua Xavantes, 819",
  "Seg a sex, 7:30-17:00",
] as const;

const carameloJamonImage = {
  src: `${ASSET_BASE_PATH}/combos/caramelo_jamon.png`,
  alt: "Café com leite, croissant jamon e sanduíche do Buzz Café",
  width: 1086,
  height: 1448,
} as const satisfies ImageAsset;

const manhaLeveImage = {
  src: `${ASSET_BASE_PATH}/combos/manha_leve.png`,
  alt: "Iced latte e yogurt com frutas do Buzz Café",
  width: 1086,
  height: 1448,
} as const satisfies ImageAsset;

const matchaCrunchImage = {
  src: `${ASSET_BASE_PATH}/combos/matcha_crunch_single.png`,
  alt: "Matcha latte e sanduíche crunch do Buzz Café",
  width: 1086,
  height: 1448,
} as const satisfies ImageAsset;

const matchaChocolateImage = {
  src: `${ASSET_BASE_PATH}/combos/matcha_chocolate.png`,
  alt: "Matcha gelado e croissant de chocolate do Buzz Café",
  width: 1086,
  height: 1448,
} as const satisfies ImageAsset;

const duplaGeladaImage = {
  src: `${ASSET_BASE_PATH}/combos/dupla_gelada.png`,
  alt: "Dois cafés gelados com caramelo do Buzz Café",
  width: 1024,
  height: 1536,
} as const satisfies ImageAsset;

export const reasons = [
  {
    key: "coffee",
    title: "Café quente ou gelado",
    description:
      "Latte, iced latte e bebidas cremosas para abrir o dia ou quebrar a tarde.",
  },
  {
    key: "breakfast",
    title: "Comida de café da manhã",
    description:
      "Croissants, sanduíches e doces com fotos reais para decidir pelo apetite.",
  },
  {
    key: "channels",
    title: "Pedido pelo canal que você usa",
    description:
      "iFood, Keeta ou 99 Food enquanto o Buzz ainda não tem checkout próprio.",
  },
] as const;

export const menuItems = [
  {
    title: "Manhã Leve",
    description: "Iced latte com yogurt, frutas, granola e cranberry.",
    image: manhaLeveImage,
  },
  {
    title: "Caramelo Jamon",
    description:
      "Café com leite, croissant jamon e sanduíche para um brunch completo.",
    image: carameloJamonImage,
  },
  {
    title: "Matcha Crunch",
    description:
      "Matcha cremoso com sanduíche crunch para uma pausa salgada.",
    image: matchaCrunchImage,
  },
  {
    title: "Matcha Chocolate",
    description: "Matcha gelado com morango e croissant de chocolate.",
    image: matchaChocolateImage,
  },
  {
    title: "Dupla Gelada",
    description: "Dois cafés gelados com caramelo para dividir ou prolongar a pausa.",
    image: duplaGeladaImage,
  },
] as const;

export const heroSlides = [
  {
    key: "manha-leve",
    eyebrow: "Leve e gelado",
    title: "Manhã Leve",
    description:
      "Iced latte com yogurt, frutas, granola e cranberry para começar o dia fresco.",
    image: menuItems[0].image,
    imagePosition: "50% 62%",
  },
  {
    key: "caramelo-jamon",
    eyebrow: "Favorito para brunch",
    title: "Caramelo Jamon",
    description:
      "Café com leite, croissant jamon e sanduíche bem montado para resolver a manhã com cara de cafeteria.",
    image: menuItems[1].image,
    imagePosition: "50% 58%",
  },
  {
    key: "matcha-crunch",
    eyebrow: "Matcha + salgado",
    title: "Matcha Crunch",
    description:
      "Matcha cremoso com sanduíche crunch para quem quer algo leve, colorido e com sustância.",
    image: menuItems[2].image,
    imagePosition: "50% 62%",
  },
  {
    key: "matcha-chocolate",
    eyebrow: "Matcha doce",
    title: "Matcha Chocolate",
    description:
      "Matcha gelado com morango e croissant de chocolate para uma pausa mais doce.",
    image: menuItems[3].image,
    imagePosition: "50% 62%",
  },
  {
    key: "dupla-gelada",
    eyebrow: "Para dividir",
    title: "Dupla Gelada",
    description:
      "Dois cafés gelados com caramelo para pedir junto ou deixar a tarde render.",
    image: menuItems[4].image,
    imagePosition: "50% 62%",
  },
] as const satisfies readonly HeroSlide[];

export const cafeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Buzz Café",
  url: "https://buzzcafe.com.br/",
  image: "https://buzzcafe.com.br/pedir-assets/hero-desktop.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Xavantes, 819",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: "Brás, São Paulo",
  servesCuisine: ["Café", "Brunch", "Doces", "Delivery"],
  openingHours: "Mo-Fr 07:30-17:00",
} as const;
