import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found-page">
        <section className="container not-found-card">
          <span className="eyebrow"><i /> Página não encontrada</span>
          <div className="not-found-icon" aria-hidden="true">
            <Search />
          </div>
          <h1>Esse produto ou página saiu da prateleira.</h1>
          <p>
            O endereço pode ter mudado ou não existir mais. Volte para a vitrine e encontre os produtos ativos da
            Tudo Express Brasil.
          </p>
          <div className="not-found-actions">
            <Link className="btn btn-primary" href="/#produtos">
              Ver produtos
            </Link>
            <Link className="btn btn-ghost" href="/">
              <ArrowLeft aria-hidden="true" /> Voltar ao início
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
