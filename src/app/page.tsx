import {
  ArrowRight,
  Check,
  Heart,
  ShieldCheck,
  Star,
  Truck,
  Zap
} from "lucide-react";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Reveal } from "@/components/Reveal";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicProducts } from "@/lib/products";
import { MERCADO_LIVRE_STORE_URL, SHOPEE_STORE_URL } from "@/lib/store-links";

const siteUrl = "https://tudoexpressbrasil.com.br";
const googleReviewsUrl =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0x94bc53903a9937eb:0xb78e26ae9f8c959!12e1?source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient" x1="4" x2="20" y1="20" y2="4">
          <stop offset="0" stopColor="#feda75" />
          <stop offset=".35" stopColor="#fa7e1e" />
          <stop offset=".65" stopColor="#d62976" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="18" height="18" x="3" y="3" rx="5" fill="url(#instagram-gradient)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1.2" fill="#fff" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#25F4EE" d="M14.8 3.5v10.1a4.8 4.8 0 1 1-4.8-4.8c.4 0 .8.1 1.1.2v2.9a2 2 0 1 0 1.2 1.8V3.5h2.5Z" />
      <path fill="#FE2C55" d="M16.3 3.5c.4 2.3 1.8 3.7 4.1 4v2.8a7.3 7.3 0 0 1-4.1-1.3v4.7a4.8 4.8 0 0 1-7.7 3.8 4.8 4.8 0 0 0 6.2-4.6V3.5h1.5Z" />
      <path fill="#fff" d="M14.8 3.5c.4 2.4 1.8 3.9 4.1 4.3v2.1a7.2 7.2 0 0 1-4.1-1.5v5.2a4.8 4.8 0 1 1-4.8-4.8c.4 0 .8.1 1.1.2v2.9a2 2 0 1 0 1.2 1.8V3.5h2.5Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="4" fill="#ff0033" />
      <path fill="#fff" d="m10 9 5 3-5 3V9Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.6l-3.2-2.5c-.9.6-2 .9-3.4.9a5.9 5.9 0 0 1-5.5-4H3.2v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.5 13.8a6 6 0 0 1 0-3.6V7.6H3.2a10 10 0 0 0 0 8.8l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.8 5.6l3.3 2.6a5.9 5.9 0 0 1 5.5-4Z" />
    </svg>
  );
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getPublicProducts();
  const honeyProducts = products.filter((product) => product.category.toLowerCase().includes("onda mel"));
  const utilityProducts = products.filter((product) => !product.category.toLowerCase().includes("onda mel"));

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tudo Express Brasil",
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    email: "tudoexpressbrasil@gmail.com",
    telephone: "+55 17 98146-8455",
    sameAs: [
      "https://www.instagram.com/tudoexpressbrasil",
      "https://www.tiktok.com/@tudoexpressbrasil",
      "https://www.youtube.com/@TudoExpressBrasil/shorts",
      "https://shopee.com.br/shop/950896809",
      "https://lista.mercadolivre.com.br/_CustId_1305039689"
    ]
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produtos em destaque da Tudo Express Brasil",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.image_url.startsWith("http") ? product.image_url : `${siteUrl}${product.image_url}`,
        brand: product.category,
        url: product.mercado_livre_url || product.shopee_url || `${siteUrl}/produtos/${product.slug}`
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <SiteHeader />

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-grid">
            <Reveal className="hero-copy">
              <span className="eyebrow"><i /> Curadoria para a vida real</span>
              <h1>
                Escolhas que <span className="hero-title-phrase">fazem a <em>diferença</em></span> no seu dia.
              </h1>
              <p>Produtos úteis, naturais e selecionados com cuidado, com a segurança de comprar nos maiores marketplaces do Brasil.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#produtos">Conhecer produtos <ArrowRight className="inline-icon" aria-hidden="true" /></a>
                <a className="btn btn-ghost marketplace-cta" href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-shopee-oficial.jpg" alt="" />
                  <span>Shopee</span><ArrowRight className="inline-icon" aria-hidden="true" />
                </a>
                <a className="btn btn-ghost marketplace-cta" href={MERCADO_LIVRE_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-mercado-livre-transparente-trim.png" alt="" />
                  <span>Mercado Livre</span><ArrowRight className="inline-icon" aria-hidden="true" />
                </a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span><Check /></span>
                  <span><Star /></span>
                  <span><Heart /></span>
                </div>
                <p><strong>Compra protegida</strong><br />pelo Mercado Livre e Shopee</p>
              </div>
            </Reveal>

            <Reveal className="hero-visual">
              <div className="honey-ring ring-one" />
              <div className="honey-ring ring-two" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-product hero-product-main" src="/assets/mel-propolis.png" alt="Mel com própolis Onda Mel de 500 gramas" fetchPriority="high" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-product hero-product-side hero-product-support-bg" src="/assets/hero-suporte-celular-transparent.png" alt="Suporte universal para celular e tablet" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-product hero-product-cup-right" src="/assets/hero-copo-termico-transparent.png" alt="Copo térmico inox com tampa e abridor" />
              <div className="floating-card card-fast"><span><Zap /></span><div><strong>Compra fácil</strong><small>Em poucos cliques</small></div></div>
            </Reveal>
          </div>
        </section>

        <section className="trust-strip" aria-label="Vantagens de comprar conosco">
          <div className="container trust-grid">
            <div><span><Check /></span><p><strong>Seleção cuidadosa</strong><small>Produtos que fazem sentido</small></p></div>
            <div><span><ShieldCheck /></span><p><strong>Pagamento protegido</strong><small>Compra nos marketplaces</small></p></div>
            <div><span><Truck /></span><p><strong>Entrega acompanhada</strong><small>Do pedido até sua casa</small></p></div>
            <div><span><Heart /></span><p><strong>Atendimento próximo</strong><small>Estamos no WhatsApp</small></p></div>
          </div>
        </section>

        <section className="products section" id="produtos">
          <div className="container">
            <Reveal className="section-head">
              <div><span className="eyebrow"><i /> Seleção Onda Mel</span><h2>Do apiário para a sua mesa</h2></div>
              <p>Mel puro em diferentes floradas e combinações para você encontrar o seu favorito.</p>
            </Reveal>
            <ProductCarousel ariaLabel="Carrossel de produtos Onda Mel" products={honeyProducts} />
          </div>
        </section>

        <section className="feature section" id="curadoria">
          <div className="container feature-grid">
            <Reveal className="feature-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/banner-suporte-universal.webp" alt="Suporte universal para celular e tablet" loading="lazy" />
            </Reveal>
            <Reveal className="feature-copy">
              <span className="eyebrow eyebrow-light"><i /> Muito além do mel</span>
              <h2>Produtos que resolvem.<br />Sem complicação.</h2>
              <p>Na Tudo Express Brasil, cada item entra na nossa seleção por um motivo: ser útil de verdade. Da cozinha ao home office, buscamos boas escolhas para tornar sua rotina mais prática.</p>
              <ul>
                <li><span><Check /></span> Itens úteis e funcionais</li>
                <li><span><Check /></span> Seleção com foco em custo-benefício</li>
                <li><span><Check /></span> Compra segura em canais conhecidos</li>
              </ul>
              <div className="feature-actions">
                <a className="btn btn-light marketplace-cta" href={MERCADO_LIVRE_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-mercado-livre-transparente-trim.png" alt="" />
                  <span>Explorar Mercado Livre</span><ArrowRight className="inline-icon" aria-hidden="true" />
                </a>
                <a className="btn btn-light marketplace-cta" href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-shopee-oficial.jpg" alt="" />
                  <span>Explorar na Shopee</span><ArrowRight className="inline-icon" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="products utility-products section" id="utilidades">
          <div className="container">
            <Reveal className="section-head">
              <div><span className="eyebrow"><i /> Utilidades selecionadas</span><h2>Produtos úteis para a rotina</h2></div>
              <p>Itens práticos para casa, organização, cuidado pessoal e acessórios que resolvem pequenas necessidades do dia a dia.</p>
            </Reveal>
            <ProductCarousel ariaLabel="Carrossel de produtos úteis e utilidades" products={utilityProducts} />
          </div>
        </section>

        <section className="steps section" id="como-comprar">
          <div className="container">
            <Reveal className="section-head centered">
              <span className="eyebrow"><i /> Simples e seguro</span>
              <h2>Escolha onde comprar</h2>
              <p>Você encontra a Tudo Express Brasil nos canais que já conhece e confia.</p>
            </Reveal>
            <div className="channel-grid">
              <a className="channel-card channel-ml reveal visible" href={MERCADO_LIVRE_STORE_URL} target="_blank" rel="noopener noreferrer">
                <span className="channel-icon channel-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-mercado-livre-transparente-trim.png" alt="Mercado Livre" />
                </span>
                <div><small>Loja oficial</small><h3>Mercado Livre</h3><p>Compra protegida, envio acompanhado e várias formas de pagamento.</p><strong>Acessar loja <ArrowRight className="inline-icon" aria-hidden="true" /></strong></div>
              </a>
              <a className="channel-card channel-shopee reveal visible" href={SHOPEE_STORE_URL} target="_blank" rel="noopener noreferrer">
                <span className="channel-icon channel-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-shopee-oficial.jpg" alt="Shopee" />
                </span>
                <div><small>Loja oficial</small><h3>Shopee</h3><p>Ofertas, cupons e uma experiência de compra rápida pelo app.</p><strong>Acessar loja <ArrowRight className="inline-icon" aria-hidden="true" /></strong></div>
              </a>
            </div>
          </div>
        </section>

        <section className="about-summary section" id="sobre">
          <div className="container">
            <Reveal className="about-summary-card">
              <div className="about-summary-copy">
                <span className="eyebrow"><i /> Sobre nós</span>
                <p>
                  A Tudo Express Brasil nasceu para facilitar escolhas do dia a dia com produtos úteis, naturais e selecionados com cuidado. Atuamos como uma vitrine confiável, conectando você aos nossos canais oficiais no Mercado Livre, Shopee e redes sociais, sempre com foco em praticidade, segurança e bom atendimento.
                </p>
              </div>
              <div className="about-social">
                <span className="eyebrow eyebrow-light"><i /> Acompanhe de perto</span>
                <h2>Novidades, dicas e produtos em movimento.</h2>
                <div className="social-links">
                  <a href="https://www.instagram.com/tudoexpressbrasil?igsh=MTV3dXhsamlocnU4Yw==" target="_blank" rel="noopener noreferrer"><span className="social-brand-icon"><InstagramIcon /></span>Instagram</a>
                  <a href="https://www.tiktok.com/@tudoexpressbrasil" target="_blank" rel="noopener noreferrer"><span className="social-brand-icon social-brand-icon-dark"><TikTokIcon /></span>TikTok</a>
                  <a href="https://www.youtube.com/@TudoExpressBrasil/shorts" target="_blank" rel="noopener noreferrer"><span className="social-brand-icon"><YouTubeIcon /></span>YouTube</a>
                  <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer"><span className="social-brand-icon"><GoogleIcon /></span>Avalie no Google</a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="reviews section" id="avaliacoes">
          <div className="container">
            <Reveal className="section-head centered">
              <span className="eyebrow"><i /> Avaliações no Google</span>
              <h2>Quem compra recomenda.</h2>
              <p>Prints reais das avaliações do Google: atendimento elogiado, entrega rápida e compra segura.</p>
            </Reveal>
            <ReviewCarousel />
            <div className="reviews-action">
              <a className="btn btn-primary" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">
                Avaliar no Google <ArrowRight className="inline-icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

