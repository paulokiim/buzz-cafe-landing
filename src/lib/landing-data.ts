import {
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  SITE_ORIGIN,
  STORE_ADDRESS_AREA,
  STORE_ADDRESS_DISPLAY,
  STORE_ADDRESS_STREET,
  STORE_NAME,
  STORE_PHONE_E164,
  STORE_WHATSAPP_DISPLAY,
} from "@/lib/site-config";

export const ASSET_BASE_PATH = "/pedir-assets" as const;

export const CHANNEL_KEYS = ["ifood", "keeta", "99food"] as const;
export const ORDER_REWARD = "Americano iced ou hot" as const;
export const ORDER_REWARD_LABEL =
  "Americano iced ou hot grátis" as const;
export const ORDER_REWARD_WHATSAPP_MESSAGE =
  "Oi, Buzz Café! Avaliei meu pedido e quero enviar o print para ganhar um Americano iced ou hot grátis no próximo pedido.\n\nPlataforma:\nNome do pedido:\nEscolha: iced ou hot" as const;

export type ChannelKey = (typeof CHANNEL_KEYS)[number];

export type TrackingEventName =
  | "PageView"
  | "Clique_iFood"
  | "Clique_Keeta"
  | "Clique_99Food"
  | "Clique_WhatsApp";

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
    title: "Pedir no iFood",
    description:
      "Finalize seu café, croissant ou combo pelo app. Depois de avaliar sua experiência, envie o print no WhatsApp para garantir o brinde.",
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
    title: "Pedir no Keeta",
    description:
      "Faça o pedido pelo Keeta. Depois de avaliar sua experiência, mande o print no WhatsApp para ganhar o Americano.",
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
    title: "Pedir no 99 Food",
    description:
      "Abra o 99 Food, finalize por lá e envie o print da avaliação no WhatsApp para receber o brinde.",
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
  STORE_ADDRESS_DISPLAY,
  "Seg a sex, 7:30-17:00",
] as const;

export const HERO_SEO_TITLE =
  "Cafeteria no Brás para pedir agora" as const;
export const HERO_SEO_DESCRIPTION =
  "Cafés quentes e gelados, croissants, doces, salgados e combos de café da manhã na Rua Xavantes, perto do Pari." as const;

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

export const localSeoHighlights = [
  {
    title: "Cafeteria no Brás",
    description:
      "O Buzz Café fica na Rua Xavantes, 819, para quem está no Brás e quer pedir café sem perder tempo.",
  },
  {
    title: "Perto do Pari",
    description:
      "Uma opção prática para café da manhã, brunch e pausa da tarde para quem mora, trabalha ou circula pelo Pari.",
  },
  {
    title: "Doces, salgados e combos",
    description:
      "Croissants, sanduíches, cafés gelados, matcha, doces e salgados com fotos reais antes de abrir o app.",
  },
] as const;

export const faqItems = [
  {
    question: "O Buzz Café fica no Brás?",
    answer:
      "Sim. O Buzz Café fica na Rua Xavantes, 819, no Brás, em São Paulo.",
  },
  {
    question: "O Buzz Café atende quem está no Pari?",
    answer:
      "Sim. Quem está perto do Pari pode pedir pelo iFood, Keeta ou 99 Food, conforme a disponibilidade da plataforma.",
  },
  {
    question: "O que pedir no Buzz Café?",
    answer:
      "A landing destaca cafés quentes e gelados, croissants, sanduíches, doces, salgados, matcha e combos de café da manhã.",
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
  "@id": `${SITE_ORIGIN}/#buzz-cafe`,
  name: STORE_NAME,
  alternateName: "Buzz Cafe",
  description:
    "Cafeteria no Brás para pedir café da manhã, cafés, croissants, doces, salgados e combos perto do Pari.",
  url: `${SITE_ORIGIN}/`,
  telephone: STORE_PHONE_E164,
  image: [
    `${SITE_ORIGIN}/pedir-assets/hero-desktop.webp`,
    `${SITE_ORIGIN}/pedir-assets/combos/manha_leve.png`,
    `${SITE_ORIGIN}/pedir-assets/combos/caramelo_jamon.png`,
  ],
  logo: `${SITE_ORIGIN}/pedir-assets/brand-logo-header-transparent.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE_ADDRESS_STREET,
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: STORE_ADDRESS_AREA,
    },
    {
      "@type": "AdministrativeArea",
      name: "Pari, São Paulo",
    },
  ],
  servesCuisine: [
    "Café",
    "Café da manhã",
    "Brunch",
    "Doces",
    "Salgados",
    "Croissant",
    "Sanduíches",
    "Delivery",
  ],
  openingHours: "Mo-Fr 07:30-17:00",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "17:00",
    },
  ],
  hasMap: GOOGLE_MAPS_URL,
  menu: `${SITE_ORIGIN}/#cardapio`,
  priceRange: "$$",
  sameAs: [INSTAGRAM_URL],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: STORE_PHONE_E164,
    contactType: "customer service",
    areaServed: "BR",
    availableLanguage: "Portuguese",
  },
} as const;

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
} as const;

export const storeContactSummary = {
  address: STORE_ADDRESS_DISPLAY,
  phone: STORE_WHATSAPP_DISPLAY,
  mapsUrl: GOOGLE_MAPS_URL,
} as const;
