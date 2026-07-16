import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade | Tudo Express Brasil",
  description: "Entenda como a Tudo Express Brasil trata dados básicos de navegação e direcionamento para canais parceiros."
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="container legal-card">
          <Link className="product-back" href="/">
            <ArrowLeft aria-hidden="true" /> Voltar para o site
          </Link>
          <span className="eyebrow"><i /> Transparência</span>
          <h1>Política de Privacidade</h1>
          <p>
            A Tudo Express Brasil atua como vitrine digital, apresentando produtos selecionados e direcionando visitantes
            para canais parceiros de compra, como Mercado Livre, Shopee e WhatsApp.
          </p>

          <h2>Dados coletados</h2>
          <p>
            Este site não processa pagamentos, não solicita dados bancários e não finaliza compras diretamente. Podemos
            usar dados básicos de navegação, como páginas acessadas e cliques em links externos, para entender o desempenho
            do site e melhorar a experiência.
          </p>

          <h2>Links externos</h2>
          <p>
            Ao clicar em Mercado Livre, Shopee, WhatsApp, Instagram, TikTok, YouTube ou Google, você será direcionado para
            plataformas externas. Cada plataforma possui sua própria política de privacidade e seus próprios termos de uso.
          </p>

          <h2>Contato</h2>
          <p>
            Para dúvidas sobre esta política ou sobre os produtos apresentados no site, fale conosco pelo WhatsApp ou pelo
            e-mail <a href="mailto:tudoexpressbrasil@gmail.com">tudoexpressbrasil@gmail.com</a>.
          </p>

          <p className="legal-note">Última atualização: julho de 2026.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
