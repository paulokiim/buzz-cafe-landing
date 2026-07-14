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
  faqItems,
  faqJsonLd,
  heroActions,
  heroSlides,
  localSeoHighlights,
  menuItems,
  ORDER_REWARD,
  ORDER_REWARD_LABEL,
  reasons,
  storeContactSummary,
} from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buzz Café no Brás | Cafeteria e café da manhã",
  description:
    "Peça cafés, doces, salgados, croissants e combos do Buzz Café na Rua Xavantes, 819, no Brás, perto do Pari. Delivery por iFood, Keeta e 99 Food.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Buzz Café no Brás | Cafeteria e café da manhã",
    description:
      "Cafés, croissants, doces, salgados e combos do Buzz Café no Brás, perto do Pari.",
    url: "/",
    images: [
      {
        url: "/pedir-assets/hero-desktop.webp",
        width: 1440,
        height: 795,
        alt: "Café, croissant e sanduíche do Buzz Café no Brás",
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

export default function HomePage() {
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
        <LocalSeoSection />
        <WhySection />
        <MenuSection />
        <FaqSection />
      </main>
      <Footer />
      <MobileOrderBar orderChannels={channels} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(cafeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
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
          eyebrow="Brinde no próximo pedido"
          id="pedido-title"
          title="Printou, mandou, ganhou!"
        >
          Peça pelo iFood, Keeta ou 99 Food. Depois, envie o print da avaliação
          no WhatsApp para ganhar {ORDER_REWARD_LABEL} no próximo pedido.
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
                  <span className="shrink-0 text-sm font-bold text-[var(--buzz-muted)]">
                    Brinde
                  </span>
                  <strong className="max-w-[210px] text-right text-base leading-tight font-black tracking-[0]">
                    {ORDER_REWARD}
                  </strong>
                </div>
                <Separator className="bg-[var(--buzz-line)]" />
              </div>
              <p className="text-sm leading-relaxed text-[var(--buzz-muted)]">
                Depois de avaliar sua experiência na plataforma, mande o print
                no WhatsApp para receber no próximo pedido.
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

function LocalSeoSection() {
  return (
    <section
      aria-labelledby="local-title"
      className="mx-auto w-[min(1160px,calc(100%_-_36px))] pt-12 pb-7 md:pt-20"
      id="local"
    >
      <Reveal>
        <SectionHeading
          compact
          eyebrow="Cafeteria no Brás"
          id="local-title"
          title="Café, doces e salgados perto do Pari"
        >
          O Buzz Café fica na {storeContactSummary.address}. A página continua
          focada em pedido rápido, mas também ajuda quem procura café da manhã,
          brunch, doces e salgados na região do Brás e do Pari.
        </SectionHeading>
      </Reveal>
      <ul className="grid list-none gap-3 p-0 md:grid-cols-3">
        {localSeoHighlights.map((highlight, index) => (
          <Reveal
            as="li"
            className="border-t border-[var(--buzz-line)] pt-5"
            delay={index * 90}
            key={highlight.title}
          >
            <h3 className="text-[1.08rem] leading-tight font-black tracking-[0]">
              {highlight.title}
            </h3>
            <p className="mt-2 text-[var(--buzz-muted)]">
              {highlight.description}
            </p>
          </Reveal>
        ))}
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

function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto w-[min(900px,calc(100%_-_36px))] pt-2 pb-24 md:pb-32"
      id="duvidas"
    >
      <Reveal>
        <SectionHeading
          compact
          eyebrow="Dúvidas rápidas"
          id="faq-title"
          title="Antes de pedir no Buzz"
        />
      </Reveal>
      <div className="divide-y divide-[var(--buzz-line)] border-y border-[var(--buzz-line)]">
        {faqItems.map((item) => (
          <details className="group py-4" key={item.question}>
            <summary className="cursor-pointer list-none text-[1.02rem] font-black tracking-[0] marker:hidden">
              {item.question}
            </summary>
            <p className="mt-2 text-[var(--buzz-muted)]">{item.answer}</p>
          </details>
        ))}
      </div>
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

function toJsonLd(payload: unknown) {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
