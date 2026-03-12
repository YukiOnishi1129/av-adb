import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { WebsiteJsonLd } from "@/components/json-ld";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-Y87M80KS29";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AV-ADB | アダルトAV動画レビュー・おすすめ作品紹介",
  description:
    "FANZAの人気作品をレビュー。AV動画 おすすめランキング、セール情報、女優別作品まとめ。高画質対応作品を厳選紹介。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: "/favicon-256.png",
  },
  openGraph: {
    title: "AV-ADB | アダルトAV動画レビュー",
    description:
      "FANZAの人気作品をレビュー。おすすめランキング、セール情報を毎日更新。",
    type: "website",
    images: [
      {
        url: "https://av-adb.com/ogp/top_ogp.png",
        width: 1200,
        height: 630,
        alt: "AV-ADB | アダルトAV動画レビュー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AV-ADB | アダルトAV動画レビュー",
    description:
      "FANZAの人気作品をレビュー。おすすめランキング、セール情報を毎日更新。",
    images: ["https://av-adb.com/ogp/top_ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <WebsiteJsonLd
          url="https://av-adb.com"
          name="AV-ADB"
          description="FANZAの人気作品をレビュー。AV動画 おすすめランキング、セール情報、女優別作品まとめ。"
        />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
