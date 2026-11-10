# DŌB. Creative Studio — Site institucional

Site estático pronto para subir na **Vercel**. Não precisa instalar Node, NPM, banco de dados nem framework.

## Arquivos

- `index.html` — conteúdo e estrutura do site.
- `styles.css` — identidade visual responsiva, animações e layout.
- `script.js` — menu mobile, simulador, animações e formulário via WhatsApp.
- `assets/favicon.svg` — ícone tipográfico provisório.
- `assets/og-dob.svg` — imagem de compartilhamento provisória.

## Publicar na Vercel

1. Extraia o ZIP e mantenha os arquivos na raiz da pasta.
2. No painel Vercel, crie um projeto e envie a pasta ao importar seu repositório Git (ou use a Vercel CLI com `vercel` dentro dela).
3. **Framework Preset:** `Other`; **Build Command:** deixe vazio; **Output Directory:** `.` (raiz do projeto).
4. Publique. Pronto: a homepage é `index.html`.

Também é possível testar localmente abrindo `index.html` no navegador.

## Personalizar dados

- WhatsApp: `script.js` -> `CONFIG.whatsapp`, **e** links `wa.me` em `index.html`.
- Valores e limite da calculadora: `script.js` -> `CONFIG.packages`, `CONFIG.addons` e `CONFIG.threshold`. **Se alterar os valores**, atualize os preços escritos em `index.html` para manter a interface coerente.
- Links de reels: `index.html`, seção `id="casamentos"`.
- Perfil de Instagram: `index.html`, links atuais no simulador e contato.
- Oferta Super Black: `index.html`, seção `id="black"`.
- Identidade: substitua o logotipo tipográfico por seu arquivo oficial, se desejado. Não há logo oficial anexada a este pacote.

## Observações importantes

- A calculadora mostra valores **estimados** de mensalidade e muda para "Consultar especialista" quando o total **ultrapassa R$ 3.000**, ou quando o pacote personalizado é escolhido.
- O orçamento simulado **não é uma cotação vinculante**. Verba publicitária e valores de serviços pontuais não estão incluídos.
- O site usa fontes do Google Fonts; há fallbacks locais se a fonte externa não carregar.
- Os cards de casamento apontam para os 4 reels fornecidos. Não são prévias de vídeo hospedadas na Vercel.
- Formulário: abre o WhatsApp com o texto preenchido. Não envia e-mails nem armazena informações.
- Os mockups e gráficos são **conceituais**, não resultados comprovados ou casos de clientes.
- Não inclui rastreadores, cookies nem dependências JavaScript de terceiros.
