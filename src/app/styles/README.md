# Organização dos estilos

Os estilos globais foram separados por responsabilidade e importados em `src/app/layout.tsx`.

A ordem dos imports deve ser preservada, porque o CSS usa cascata e alguns arquivos finais refinam regras criadas nos primeiros arquivos.

- `01-foundation.css`: base visual, variáveis, layout principal e primeira responsividade.
- `02-admin.css`: estrutura principal do painel administrativo.
- `03-site-polish.css`: refinamentos visuais da home, carrosséis, marcas e botões.
- `04-product-detail-admin.css`: página individual de produto e ajustes complementares do admin.
- `05-reviews-footer.css`: carrossel de avaliações, rodapé e responsividade relacionada.
- `06-final-adjustments.css`: ajustes finais aprovados pelo cliente e correções específicas de responsividade.

Ao adicionar novos estilos, prefira criar blocos pequenos com comentário claro no arquivo mais relacionado ao componente alterado.
