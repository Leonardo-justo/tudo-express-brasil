import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./styles/01-foundation.css";
import "./styles/02-admin.css";
import "./styles/03-site-polish.css";
import "./styles/04-product-detail-admin.css";
import "./styles/05-reviews-footer.css";
import "./styles/06-final-adjustments.css";

const siteUrl = "https://tudoexpressbrasil.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tudo Express Brasil | Produtos úteis no Mercado Livre e Shopee",
  description: "Produtos úteis, naturais e selecionados para facilitar o seu dia. Compre com segurança pela Tudo Express Brasil nos canais oficiais.",
  authors: [{ name: "Tudo Express Brasil" }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tudo Express Brasil | Escolhas que facilitam seu dia",
    description: "Mel puro, utilidades e produtos selecionados com compra segura nos maiores marketplaces do Brasil.",
    url: "/",
    siteName: "Tudo Express Brasil",
    images: [
      {
        url: "/assets/og-tudo-express.jpg",
        width: 1024,
        height: 683,
        alt: "Mascote da Tudo Express Brasil"
      }
    ],
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tudo Express Brasil | Produtos úteis no Mercado Livre e Shopee",
    description: "Produtos úteis, naturais e selecionados para facilitar sua rotina com compra segura nos canais oficiais.",
    images: ["/assets/og-tudo-express.jpg"]
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large"
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
