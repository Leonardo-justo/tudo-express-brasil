import Link from "next/link";
import { Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link className="brand brand-footer" href="/#inicio">
              <span className="brand-mark brand-logo-mark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo-tudo-express-transparente-trim.png" alt="" />
              </span>
              <span>
                <strong>Tudo Express</strong>
                <small>Brasil</small>
              </span>
            </Link>
            <p>Escolhas inteligentes para uma rotina mais simples.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer-avatar" src="/assets/avatar-carrinho-transparente-trim.png" alt="Mascote da Tudo Express Brasil" />
          </div>
          <div>
            <h3>Navegue</h3>
            <Link href="/#produtos">Produtos</Link>
            <Link href="/#como-comprar">Como comprar</Link>
            <Link href="/#sobre">Sobre n&oacute;s</Link>
            <Link href="/privacidade">Pol&iacute;tica de Privacidade</Link>
          </div>
          <div>
            <h3>Atendimento</h3>
            <a href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="mailto:tudoexpressbrasil@gmail.com">tudoexpressbrasil@gmail.com</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tudo Express Brasil. Todos os direitos reservados.</p>
          <p>Compra processada com seguran&ccedil;a pelos marketplaces parceiros.</p>
        </div>
      </footer>

      <a className="whatsapp" href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Tudo Express Brasil pelo WhatsApp">
        <span><Phone /></span>
        <em>Podemos ajudar?</em>
      </a>
    </>
  );
}
