import Script from "next/script";

import {
  analyticsConfig,
  shouldLoadDirectGoogleTag,
  shouldLoadDirectMetaPixel,
} from "@/lib/analytics-config";

export function AnalyticsProviders() {
  const {
    gaMeasurementId,
    googleAdsConversionId,
    googleTagManagerId,
    metaPixelId,
  } = analyticsConfig;

  return (
    <>
      {googleTagManagerId ? (
        <Script id="buzz-google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      ) : null}

      {shouldLoadDirectGoogleTag ? (
        <>
          <Script
            id="buzz-google-tag-js"
            src={`https://www.googletagmanager.com/gtag/js?id=${
              gaMeasurementId ?? googleAdsConversionId
            }`}
            strategy="afterInteractive"
          />
          <Script id="buzz-google-tag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              ${
                gaMeasurementId
                  ? `gtag('config', '${gaMeasurementId}', { send_page_view: true });`
                  : ""
              }
              ${
                googleAdsConversionId
                  ? `gtag('config', '${googleAdsConversionId}');`
                  : ""
              }
            `}
          </Script>
        </>
      ) : null}

      {shouldLoadDirectMetaPixel ? (
        <Script id="buzz-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}

export function AnalyticsNoScript() {
  const { googleTagManagerId, metaPixelId } = analyticsConfig;

  return (
    <>
      {googleTagManagerId ? (
        <noscript>
          <iframe
            height="0"
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
            width="0"
          />
        </noscript>
      ) : null}
      {shouldLoadDirectMetaPixel ? (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="1"
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            style={{ display: "none" }}
            width="1"
          />
        </noscript>
      ) : null}
    </>
  );
}
