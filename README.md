# Tudo Express Brasil

Site institucional e vitrine de produtos da Tudo Express Brasil.

O projeto é estático, responsivo e preparado para publicação na Vercel com domínio próprio, sitemap, robots.txt, metadados sociais e SEO técnico básico.

## Estrutura

- `index.html`: conteúdo principal, SEO, metadados e dados estruturados.
- `css/styles.css`: identidade visual, layout e responsividade.
- `js/script.js`: menu mobile, animações e ano automático do rodapé.
- `assets/`: imagens e produtos do cliente.
- `robots.txt`: orientação para mecanismos de busca.
- `sitemap.xml`: mapa do site para indexação.
- `vercel.json`: configuração de publicação, URLs limpas, cache e headers.
- `site.webmanifest` e `favicon.svg`: identidade básica para navegador/dispositivo.

## Publicação na Vercel

1. Suba o projeto para o GitHub.
2. Na Vercel, clique em “Add New Project”.
3. Importe o repositório `tudo-express-brasil`.
4. Framework Preset: `Other`.
5. Build Command: deixe vazio.
6. Output Directory: deixe vazio.
7. Clique em “Deploy”.

## Domínio

Domínio planejado:

```text
https://tudoexpressbrasil.com.br/
```

Depois do deploy na Vercel:

1. Abra o projeto na Vercel.
2. Vá em “Settings” > “Domains”.
3. Adicione `tudoexpressbrasil.com.br`.
4. Siga os registros DNS indicados pela Vercel no provedor do domínio.
5. Aguarde a propagação.

## SEO

Arquivos importantes:

- `sitemap.xml`: `https://tudoexpressbrasil.com.br/sitemap.xml`
- `robots.txt`: `https://tudoexpressbrasil.com.br/robots.txt`
- URL canônica: `https://tudoexpressbrasil.com.br/`

Após o domínio estar ativo, recomenda-se cadastrar o site no Google Search Console e enviar o sitemap.

## Manutenção

Para adicionar novos produtos, duplique um bloco `.product-card` no `index.html`, troque imagem, nome, descrição e link de compra.
