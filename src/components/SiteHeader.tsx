"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/#inicio" aria-label="Tudo Express Brasil - início" onClick={closeMenu}>
          <span className="brand-mark brand-logo-mark" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-tudo-express-transparente-trim.png" alt="" />
          </span>
          <span>
            <strong>Tudo Express</strong>
            <small>Brasil</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav${open ? " open" : ""}`} aria-label="Navegação principal">
          <Link href="/#produtos" onClick={closeMenu}>Produtos</Link>
          <Link href="/#como-comprar" onClick={closeMenu}>Como comprar</Link>
          <Link href="/#sobre" onClick={closeMenu}>Sobre nós</Link>
          <a className="nav-cta" href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            Fale conosco
          </a>
        </nav>
        <a className="header-avatar" href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Tudo Express Brasil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/avatar-carrinho-transparente-trim.png" alt="" />
        </a>
      </div>
    </header>
  );
}
