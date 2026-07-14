import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicProducts } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tudoexpressbrasil.com.br";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getPublicProducts();

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
        url: product.mercado_livre_url || product.shopee_url || siteUrl
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
              <h1>Escolhas que deixam o seu dia mais <em>simples.</em></h1>
              <p>Produtos úteis, naturais e selecionados com cuidado — e a segurança de comprar nos maiores marketplaces do Brasil.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#produtos">Conhecer produtos <span aria-hidden="true">→</span></a>
                <a className="btn btn-ghost" href="https://lista.mercadolivre.com.br/_CustId_1305039689" target="_blank" rel="noopener noreferrer">Visitar loja oficial</a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true"><span>✓</span><span>★</span><span>♥</span></div>
                <p><strong>Compra protegida</strong><br />pelo Mercado Livre e Shopee</p>
              </div>
            </Reveal>

            <Reveal className="hero-visual">
              <div className="honey-ring ring-one" />
              <div className="honey-ring ring-two" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-product hero-product-main" src="/assets/mel-propolis.png" alt="Mel com própolis Onda Mel de 500 gramas" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-product hero-product-side" src="/assets/mel-laranjeira.png" alt="Mel florada de laranjeira Onda Mel de 500 gramas" />
              <div className="floating-card card-natural"><span>🍯</span><div><strong>100% natural</strong><small>Sabor e qualidade</small></div></div>
              <div className="floating-card card-fast"><span>⚡</span><div><strong>Compra fácil</strong><small>Em poucos cliques</small></div></div>
            </Reveal>
          </div>
        </section>

        <section className="trust-strip" aria-label="Vantagens de comprar conosco">
          <div className="container trust-grid">
            <div><span>✓</span><p><strong>Seleção cuidadosa</strong><small>Produtos que fazem sentido</small></p></div>
            <div><span>▣</span><p><strong>Pagamento protegido</strong><small>Compra nos marketplaces</small></p></div>
            <div><span>↗</span><p><strong>Entrega acompanhada</strong><small>Do pedido até sua casa</small></p></div>
            <div><span>♡</span><p><strong>Atendimento próximo</strong><small>Estamos no WhatsApp</small></p></div>
          </div>
        </section>

        <section className="products section" id="produtos">
          <div className="container">
            <Reveal className="section-head">
              <div><span className="eyebrow"><i /> Seleção Onda Mel</span><h2>Do apiário para a sua mesa</h2></div>
              <p>Mel puro em diferentes floradas e combinações para você encontrar o seu favorito.</p>
            </Reveal>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="feature section" id="sobre">
          <div className="container feature-grid">
            <Reveal className="feature-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/banner-suporte.png" alt="Suporte universal para celular e tablet" loading="lazy" />
              <span className="feature-badge">Utilidade<br /><strong>todo dia</strong></span>
            </Reveal>
            <Reveal className="feature-copy">
              <span className="eyebrow eyebrow-light"><i /> Muito além do mel</span>
              <h2>Produtos que resolvem.<br />Sem complicação.</h2>
              <p>Na Tudo Express Brasil, cada item entra na nossa seleção por um motivo: ser útil de verdade. Da cozinha ao home office, buscamos boas escolhas para tornar sua rotina mais prática.</p>
              <ul>
                <li><span>✓</span> Itens úteis e funcionais</li>
                <li><span>✓</span> Seleção com foco em custo-benefício</li>
                <li><span>✓</span> Compra segura em canais conhecidos</li>
              </ul>
              <div className="feature-actions">
                <a className="btn btn-light marketplace-cta" href="https://lista.mercadolivre.com.br/_CustId_1305039689" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-mercado-livre.png" alt="" />
                  Explorar no Mercado Livre <span>→</span>
                </a>
                <a className="btn btn-light marketplace-cta" href="https://shopee.com.br/shop/950896809" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-shopee-clean.svg" alt="" />
                  Explorar na Shopee <span>→</span>
                </a>
              </div>
            </Reveal>
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
              <a className="channel-card channel-ml reveal visible" href="https://lista.mercadolivre.com.br/_CustId_1305039689" target="_blank" rel="noopener noreferrer">
                <span className="channel-icon channel-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-mercado-livre.png" alt="Mercado Livre" />
                </span>
                <div><small>Loja oficial</small><h3>Mercado Livre</h3><p>Compra protegida, envio acompanhado e várias formas de pagamento.</p><strong>Acessar loja <span>→</span></strong></div>
              </a>
              <a className="channel-card channel-shopee reveal visible" href="https://shopee.com.br/shop/950896809" target="_blank" rel="noopener noreferrer">
                <span className="channel-icon channel-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-shopee-clean.svg" alt="Shopee" />
                </span>
                <div><small>Loja oficial</small><h3>Shopee</h3><p>Ofertas, cupons e uma experiência de compra rápida pelo app.</p><strong>Acessar loja <span>→</span></strong></div>
              </a>
            </div>
          </div>
        </section>

        <section className="social section">
          <Reveal className="container social-box">
            <div><span className="eyebrow eyebrow-light"><i /> Acompanhe de perto</span><h2>Novidades, dicas e<br />produtos em movimento.</h2></div>
            <div className="social-links">
              <a href="https://www.instagram.com/tudoexpressbrasil?igsh=MTV3dXhsamlocnU4Yw==" target="_blank" rel="noopener noreferrer"><span>◎</span>Instagram</a>
              <a href="https://www.tiktok.com/@tudoexpressbrasil" target="_blank" rel="noopener noreferrer"><span>♪</span>TikTok</a>
              <a href="https://www.youtube.com/@TudoExpressBrasil/shorts" target="_blank" rel="noopener noreferrer"><span>▶</span>YouTube</a>
              <a href="https://www.google.com/maps/place//data=!4m3!3m2!1s0x94bc53903a9937eb:0xb78e26ae9f8c959!12e1?source=g.page.m.ia._&laa=nmx-review-solicitation-ia2" target="_blank" rel="noopener noreferrer"><span>★</span>Avalie no Google</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div><a className="brand brand-footer" href="#inicio"><span className="brand-mark brand-logo-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-tudo-express.png" alt="" />
          </span><span><strong>Tudo Express</strong><small>Brasil</small></span></a><p>Escolhas inteligentes para uma rotina mais simples.</p></div>
          <div><h3>Navegue</h3><a href="#produtos">Produtos</a><a href="#como-comprar">Como comprar</a><a href="#sobre">Sobre nós</a></div>
          <div><h3>Atendimento</h3><a href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="mailto:tudoexpressbrasil@gmail.com">tudoexpressbrasil@gmail.com</a></div>
        </div>
        <div className="container footer-bottom"><p>© {new Date().getFullYear()} Tudo Express Brasil. Todos os direitos reservados.</p><p>Compra processada com segurança pelos marketplaces parceiros.</p></div>
      </footer>

      <a className="whatsapp" href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Tudo Express Brasil pelo WhatsApp"><span>✆</span><em>Podemos ajudar?</em></a>
    </>
  );
}
