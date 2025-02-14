"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"; // used for vercel Analytics, login to vercel to see events, page usage
import Script from "next/script";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { FilterProvider } from "@/components/AI/FilterContext"; // for mpa, arzt, pro mode filter for models and theme

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="de">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5QZFZCC7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YP0C4PGBG5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YP0C4PGBG5');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5QZFZCC7');
          `}
        </Script>

        <FilterProvider>
          <Providers>
            <Header />

            {children}

            <Analytics mode={"production"} />
            {/* <Footer /> */}
            <ScrollToTop />
          </Providers>
        </FilterProvider>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
