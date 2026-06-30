import type { Metadata } from "next";
import Image from "next/image";
import { Coffee, Croissant, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChannelAction } from "@/components/pedir/channel-action";
import { HeroCarousel } from "@/components/pedir/hero-carousel";
import { ImageCarousel } from "@/components/pedir/image-carousel";
import { MobileOrderBar } from "@/components/pedir/mobile-order-bar";
import { OrderTrackingProvider } from "@/components/pedir/order-tracking-provider";
import { Reveal } from "@/components/pedir/reveal";
import { SiteHeader } from "@/components/pedir/site-header";
import {
  ASSET_BASE_PATH,
  cafeJsonLd,
  channels,
  heroActions,
  heroSlides,
  menuItems,
  ORDER_COUPON,
  reasons,
} from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buzz Café | Café da manhã e brunch no delivery",
  description:
    "Peça Buzz Café pelo iFood, Keeta ou 99 Food. Cafés, croissants, doces e combos para café da manhã, brunch ou pausa da tarde.",
  alternates: {
    canonical: "/pedir",
  },
  openGraph: {
    title: "Buzz Café | Café da manhã e brunch no delivery",
    description:
      "Café, croissant e combos do Buzz pelo iFood, Keeta ou 99 Food.",
    url: "/pedir",
    images: [
      {
        url: "/pedir-assets/hero-desktop.webp",
        width: 1440,
        height: 795,
        alt: "Café, croissant e sanduíche do Buzz Café",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const reasonIcons = {
  coffee: Coffee,
  breakfast: Croissant,
  channels: ShoppingBag,
} as const;

export default function PedirPage() {
  return (
    <OrderTrackingProvider>
      <a
        className="fixed top-3 left-4 z-50 -translate-y-[140%] rounded-[6px] bg-[var(--buzz-ink)] px-3.5 py-2.5 text-sm font-bold text-white transition focus:translate-y-0"
        href="#pedido"
      >
        Ir para pedido
      </a>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <OrderPanel />
        <WhySection />
        <MenuSection />
      </main>
      <Footer />
      <MobileOrderBar orderChannels={channels} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cafeJsonLd) }}
      />
    </OrderTrackingProvider>
  );
}

function HeroSection() {
  return <HeroCarousel actions={heroActions} slides={heroSlides} />;
}

function OrderPanel() {
  return (
    <section
      aria-labelledby="pedido-title"
      className="mx-auto w-[min(1160px,calc(100%_-_36px))] scroll-mt-24 pt-16 pb-11 md:scroll-mt-32 md:pt-24 md:pb-18"
      id="pedido"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Cupom de primeira compra"
          id="pedido-title"
          title={`Use ${ORDER_COUPON} em qualquer plataforma`}
        >
          O cupom {ORDER_COUPON} vale para uma compra por cliente no iFood,
          Keeta ou 99 Food. Abra a plataforma, aplique o código e finalize por lá.
        </SectionHeading>
      </Reveal>

      <div className="grid gap-3.5 lg:grid-cols-3" role="list">
        {channels.map((channel, index) => (
          <Reveal className="h-full" delay={index * 90} key={channel.key}>
            <Card
              className={cn(
                "buzz-lift-card grid h-full min-h-[334px] content-start gap-[18px] rounded-[8px] border-[var(--buzz-line)] bg-[var(--buzz-card)] p-[22px] shadow-none",
                channel.cardClassName
              )}
              role="listitem"
            >
              <div className="grid h-[54px] w-32 place-items-center justify-self-center">
                <span
                  className={cn(
                    "relative block overflow-hidden",
                    channel.key === "keeta" && "rounded-[12px]"
                  )}
                  style={{
                    height: channel.logo.height,
                    width: channel.logo.width,
                  }}
                >
                  <Image
                    alt={channel.logo.alt}
                    className="object-contain"
                    fill
                    sizes={`${channel.logo.width}px`}
                    src={channel.logo.src}
                  />
                </span>
              </div>
              <div>
                <h3 className="text-[1.08rem] leading-tight font-black tracking-[0]">
                  {channel.title}
                </h3>
                <p className="mt-2 text-[var(--buzz-muted)]">
                  {channel.description}
                </p>
              </div>
              <div className="grid gap-3">
                <Separator className="bg-[var(--buzz-line)]" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[var(--buzz-muted)]">
                    Código do cupom
                  </span>
                  <strong className="text-base font-black tracking-[0]">
                    {channel.coupon}
                  </strong>
                </div>
                <Separator className="bg-[var(--buzz-line)]" />
              </div>
              <p className="text-sm leading-relaxed text-[var(--buzz-muted)]">
                Válido uma vez por cliente. Use o código antes de concluir o
                pedido.
              </p>
              <ChannelAction
                channel={channel}
                className={cn("mt-auto w-full", channel.actionClassName)}
              />
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section
      aria-labelledby="why-title"
      className="mx-auto w-[min(1160px,calc(100%_-_36px))] pt-12 pb-7 md:pt-20"
    >
      <Reveal>
        <SectionHeading
          compact
          eyebrow="Experiência de cafeteria"
          id="why-title"
          title="O pedido certo para cada vontade"
        />
      </Reveal>
      <ul className="grid list-none gap-3 p-0 md:grid-cols-3">
        {reasons.map((reason, index) => {
          const Icon = reasonIcons[reason.key];

          return (
            <Reveal
              as="li"
              delay={index * 90}
              key={reason.key}
              className="border-t border-[var(--buzz-line)] pt-5"
            >
              <Icon
                aria-hidden="true"
                className="mb-3 size-[18px] text-[var(--buzz-sage-dark)]"
                strokeWidth={2.4}
              />
              <h3 className="text-[1.08rem] leading-tight font-black tracking-[0]">
                {reason.title}
              </h3>
              <p className="mt-2 text-[var(--buzz-muted)]">
                {reason.description}
              </p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

function MenuSection() {
  return (
    <section
      aria-labelledby="menu-title"
      className="mx-auto w-[min(1160px,calc(100%_-_36px))] pt-9 pb-24 md:pt-16 md:pb-32"
      id="cardapio"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Fotos reais do Buzz"
          id="menu-title"
          title="Escolha pelo que deu vontade"
        >
          Uma seleção curta de favoritos para decidir rápido antes de abrir o app:
          café cremoso, croissant, sanduíche e bebida gelada.
        </SectionHeading>
      </Reveal>
      <Reveal delay={120}>
        <ImageCarousel items={menuItems} />
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-start gap-5 border-t border-[var(--buzz-line)] bg-[var(--buzz-ink)] px-[18px] pt-6 pb-24 text-white sm:flex-row sm:items-center sm:px-16 sm:pb-8">
      <span className="relative block aspect-[491/190] w-[150px]">
        <Image
          alt="Buzz Café"
          className="object-contain brightness-0 invert"
          fill
          sizes="150px"
          src={`${ASSET_BASE_PATH}/brand-logo-header-transparent.webp`}
        />
      </span>
      <div className="grid gap-0.5 sm:mr-auto">
        <strong>Buzz Café</strong>
        <span className="text-sm text-white/[0.68]">
          Café da manhã, brunch e pausa da tarde na Rua Xavantes, 819
        </span>
      </div>
      <a className="font-black text-[var(--buzz-honey)]" href="#pedido">
        Escolher canal
      </a>
    </footer>
  );
}

function SectionHeading({
  children,
  compact = false,
  eyebrow,
  id,
  title,
}: {
  children?: React.ReactNode;
  compact?: boolean;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className={cn("max-w-[730px]", compact ? "mb-5" : "mb-7")}>
      <p className="mb-3 text-xs font-black tracking-[0] text-[var(--buzz-accent)] uppercase">
        {eyebrow}
      </p>
      <h2
        className="text-[2.55rem] leading-none font-bold tracking-[0] md:text-[4.2rem]"
        id={id}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {children ? (
        <p className="mt-3.5 max-w-[640px] text-[1.03rem] text-[var(--buzz-muted)]">
          {children}
        </p>
      ) : null}
    </div>
  );
}
