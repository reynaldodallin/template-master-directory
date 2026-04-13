# PROMPT DE CONTINUIDADE — Template Master Directory (Sessão 3+)

> **IMPORTANTE:** Anexe este documento no início da próxima conversa com a IA para restaurar o contexto completo do projeto. Última atualização: 13/04/2026.

---

## 1. Contexto do Projeto

| Campo | Valor |
|-------|-------|
| **Nome do Projeto** | Template Master Directory |
| **Empresa** | TechSites A.I. |
| **CEO** | Reynaldo Dallin |
| **Piloto Ativo** | Dubai Coffee Guide |
| **Domínio Ao Vivo** | https://dubai.fond.coffee |
| **GitHub** | https://github.com/reynaldodallin/template-master-directory |
| **Deploy** | Cloudflare Pages — projeto `dubai-coffee-dir` |
| **Fallback URL** | https://dubai-coffee-dir.pages.dev |

**Objetivo geral:** Criar um gerador de directories estáticos reutilizável (Template Master Directory) que produza sites de nicho/local SEO a partir de arquivos JSON de configuração e dados. O piloto é o Dubai Coffee Guide; o modelo será replicado para outros nichos/cidades.

---

## 2. Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Gerador | Python 3 — `build.py` (static site generator) |
| Templates | HTML5 com sistema de `{{PLACEHOLDER}}` |
| Estilos | CSS3 puro — 1600+ linhas, dark mode, mobile-first |
| Scripts | Vanilla JS — 400+ linhas (parallax, Leaflet, filtros, dark mode toggle) |
| Mapas | Leaflet.js + OpenStreetMap (gratuito, sem Mapbox) |
| Imagens | WebP (hero + listings), processadas com Python/Pillow |
| Deploy | Cloudflare Pages (CI via upload direto) |
| Versionamento | GitHub (`reynaldodallin/template-master-directory`) |

**Regras invioláveis:**
1. **NÃO** incluir WYSIWYG — zero `techsites-editor.js`, zero atributos `data-editable`
2. **SEMPRE** buildar com `python build.py configs/<slug>.json`
3. Código limpo e modular — sem dependências desnecessárias
4. Mobile-first responsivo a partir de 375px
5. Testar visualmente (desktop 1440px, mobile 375px, dark mode) antes de deployar
6. **NÃO** usar frameworks JS — vanilla only
7. Funcional primeiro, polimento depois

---

## 3. Credenciais e Acessos

> ⚠️ Estas credenciais são sensíveis. Não expor em logs públicos.

| Serviço | Dado |
|---------|------|
| **CF Account ID** | `[SEU_CF_ACCOUNT_ID]` |
| **CF API Token** | `[SEU_CF_TOKEN]` |
| **CF Pages Project** | `dubai-coffee-dir` |
| **GitHub Token** | `[SEU_GITHUB_TOKEN]` |
| **GitHub Repo** | `reynaldodallin/template-master-directory` |

**DNS configurado:** `dubai.fond.coffee` → CNAME → `dubai-coffee-dir.pages.dev` (Cloudflare Pages, proxied)

---

## 4. Estado Atual dos Arquivos

### 4.1 Arquivos do Projeto (contagem de linhas pós-Sessão 2)

| Arquivo | Linhas (aprox.) | Descrição |
|---------|----------------|-----------|
| `build.py` | ~627 | Gerador estático principal — lê config JSON, preenche templates, gera HTMLs |
| `assets/css/style.css` | ~1614 | Estilos globais: dark mode, parallax hero, Leaflet map, blog cards, responsivo |
| `assets/js/directory.js` | ~393 | Busca, filtros, sort, dark mode toggle, parallax rAF, Leaflet init + custom marker |
| `templates/index-directory.html` | ~268 | Home page — hero, listings grid, categorias, blog preview, filtros |
| `templates/listing-template.html` | ~212 | Página de listing individual — detalhes, mapa Leaflet, galeria |
| `templates/category-template.html` | ~113 | Página de categoria — listagem filtrada por tag |
| `templates/blog-template.html` | ~156 | Página do blog — cards estáticos (3 posts) |
| `templates/page-template.html` | ~101 | Páginas estáticas (about, contact, 404) |
| `configs/dubai-coffee.json` | 278 chaves | Config completa: SEO, cores, fontes, labels UI, redes sociais, etc. |
| `data/dubai-coffee/listings.json` | 5 listings | 5 cafeterias reais de Dubai com todos os campos preenchidos |
| `assets/images/hero/hero-bg.webp` | — | Imagem de fundo do hero (parallax) |
| `assets/images/listings/` | 5 arquivos | Fotos reais dos 5 listings (800×600px, WebP) |

### 4.2 HTMLs Gerados (output do build)

O comando `python build.py configs/dubai-coffee.json` gera 15 arquivos na pasta `dist/` (ou raiz de deploy):

| Arquivo | Template origem |
|---------|----------------|
| `index.html` | `index-directory.html` |
| `listing/[slug].html` × 5 | `listing-template.html` |
| `category/[slug].html` × 5 | `category-template.html` |
| `blog/index.html` | `blog-template.html` |
| `about.html` | `page-template.html` |
| `contact.html` | `page-template.html` |
| `404.html` | `page-template.html` |
| `sitemap.xml` | Gerado por `build.py` |
| `robots.txt` | Gerado por `build.py` |

**Verificação pós-build:** `0 unfilled placeholders` (todos os `{{CAMPO}}` substituídos).

---

## 5. Features Implementadas ✅

- [x] **Hero parallax** com imagem real (WebP), scroll handler via `requestAnimationFrame`
- [x] **Imagens reais** dos 5 listings (800×600px, WebP, processadas com Python/Pillow)
- [x] **Dark mode completo** — toggle light/dark, persistido em `localStorage`
- [x] **Busca e filtros** — por nome, categoria, área, ordenação (rating, nome, recência)
- [x] **Leaflet + OpenStreetMap** nas páginas de listing — mapa interativo gratuito, marcador customizado (ícone de café)
- [x] **Blog com cards estáticos** — 3 posts placeholder (RSS via SEOContent quando disponível)
- [x] **SEO completo** — Schema.org (LocalBusiness), `sitemap.xml`, `robots.txt`, Open Graph tags, meta description, canonical
- [x] **Mobile responsive** — 375px+, nav hamburger, CTA visível em mobile (bug corrigido na Sessão 1)
- [x] **15 HTMLs gerados** com 0 placeholders não preenchidos
- [x] **DNS ao vivo** — `dubai.fond.coffee` → Cloudflare Pages

---

## 6. Histórico de Sessões

| Sessão | Data (aprox.) | O que foi feito | Commits |
|--------|--------------|-----------------|---------|
| **Sessão 1** | Abril/2026 | Leitura de docs de referência (PROMPT-UNICO PDF, dubai-coffee.json, listings.json, PROJETO-DIRECTORY MD). Criação do repo completo: `build.py`, 5 templates HTML, `style.css` (1470 linhas), `directory.js` (323 linhas). Config com 278 chaves. 5 listings reais. Build: 15 HTMLs, 0 placeholders. QA visual: desktop/mobile/dark mode. Correção bug nav CTA mobile. Deploy Cloudflare Pages. Criação repo GitHub. DNS `dubai.fond.coffee` configurado e LIVE. | Commits 1–2 |
| **Sessão 2** | Abril/2026 | Hero parallax com imagem real (WebP). Download e processamento de fotos reais para os 5 listings (800×600 WebP). Integração Leaflet/OpenStreetMap nas páginas de listing (sem Mapbox). Blog cards estáticos (3 posts, RSS pendente). Atualização CSS: estilos parallax, Leaflet, blog cards. Atualização JS: handler parallax (rAF), init Leaflet com marcador customizado. Rebuild + redeploy CF Pages. Push GitHub (3º commit). Geração de 3 docs: Blueprint, Standard Prompt, Continuity Doc (Sessão 2). | Commit 3 |
| **Sessão 3** | — | *(A iniciar)* | — |

---

## 7. Próximos Passos — Backlog Priorizado

### Alta Prioridade
- [ ] **RSS integration** — SEOContent API (aguardando disponibilidade); substituir blog cards estáticos por posts dinâmicos gerados no build
- [ ] **Mapa global na home** — Leaflet com todos os markers dos listings sobrepostos no index

### Média Prioridade
- [ ] **Google Places API automation** via n8n — coletar mais listings automaticamente para escalar o diretório
- [ ] **Segundo directory** — replicar template para outro nicho ou cidade (validar modelo de negócio)
- [ ] **Analytics** — integrar GA4 e/ou GTM via `{{CONFIG_ANALYTICS_ID}}` no config

### Baixa Prioridade / Roadmap Futuro
- [ ] **Performance** — minificação de CSS/JS no build, imagens via CDN (Cloudflare Images)
- [ ] **PWA** — service worker, manifest.json, modo offline
- [ ] **WhatsApp automation** — prospecção de novos clientes para o serviço TechSites A.I.
- [ ] **i18n** — suporte multi-idioma (en/ar para Dubai)
- [ ] **Admin dashboard** — interface separada para gerenciar listings (projeto independente)

---

## 8. Estrutura de Configuração (Resumo das 278 Chaves)

O arquivo `configs/dubai-coffee.json` organiza as chaves nos seguintes grupos:

| Grupo | Exemplos de chaves |
|-------|--------------------|
| **SEO** | `SITE_TITLE`, `META_DESCRIPTION`, `OG_IMAGE`, `CANONICAL_URL`, `SCHEMA_TYPE` |
| **Cores** | `COLOR_PRIMARY`, `COLOR_SECONDARY`, `COLOR_ACCENT`, `COLOR_BG_DARK`, `COLOR_TEXT_DARK` |
| **Fontes** | `FONT_HEADING`, `FONT_BODY`, `FONT_SIZE_BASE` |
| **Labels UI** | `LABEL_SEARCH`, `LABEL_FILTER_CAT`, `LABEL_SORT`, `BTN_CTA`, `NAV_HOME`, `NAV_BLOG` |
| **Social** | `SOCIAL_INSTAGRAM`, `SOCIAL_FACEBOOK`, `SOCIAL_TWITTER`, `SOCIAL_WHATSAPP` |
| **Hero** | `HERO_TITLE`, `HERO_SUBTITLE`, `HERO_IMAGE`, `HERO_CTA_TEXT`, `HERO_CTA_URL` |
| **Blog** | `BLOG_TITLE`, `BLOG_SUBTITLE`, `RSS_FEED_URL` |
| **Footer** | `FOOTER_TEXT`, `FOOTER_LINKS`, `COPYRIGHT` |
| **Config** | `SITE_SLUG`, `SITE_LANG`, `LISTINGS_PER_PAGE`, `ENABLE_MAP`, `ENABLE_DARK_MODE` |

---

## 9. Estrutura de Listing (Campos do listings.json)

Cada listing no `data/dubai-coffee/listings.json` contém:

```json
{
  "slug": "string",
  "name": "string",
  "category": "string",
  "area": "string",
  "address": "string",
  "phone": "string",
  "website": "string",
  "instagram": "string",
  "hours": "string",
  "rating": 0.0,
  "reviews_count": 0,
  "price_range": "string ($ / $$ / $$$)",
  "description": "string",
  "short_description": "string",
  "tags": ["array", "de", "strings"],
  "lat": 0.000000,
  "lng": 0.000000,
  "image": "string (path relativo ao assets/images/listings/)",
  "featured": false
}
```

---

## 10. Comandos Essenciais

```bash
# Build local
python build.py configs/dubai-coffee.json

# Verificar placeholders não preenchidos
grep -r "{{" dist/ | grep -v ".git"

# Deploy manual para Cloudflare Pages (via CLI Wrangler)
npx wrangler pages deploy dist/ --project-name=dubai-coffee-dir

# Push para GitHub
git add -A
git commit -m "feat: <descrição>"
git push origin main

# Ver linha count dos arquivos principais
wc -l build.py assets/css/style.css assets/js/directory.js
```

---

## 11. Como Iniciar a Sessão 3

Ao iniciar a próxima sessão, forneça este documento à IA e diga:

> "Aqui está o prompt de continuidade do projeto Template Master Directory. Estamos na Sessão 3. [Descreva o que você quer fazer nesta sessão, por exemplo: 'Quero implementar o mapa global na home' ou 'Quero adicionar o segundo directory para o nicho X'.]"

A IA deverá:
1. Confirmar que leu e entendeu o contexto
2. Listar os arquivos relevantes que precisará ver/editar
3. Propor um plano de trabalho para a sessão antes de começar a codar
4. Ao final, atualizar este documento com o histórico da Sessão 3 e incrementar para `PROMPT-CONTINUIDADE-SESSAO-3.md`

---

## 12. Notas Técnicas Importantes

- **Parallax:** Implementado com `requestAnimationFrame` no `directory.js`. O hero usa `position: fixed` no background com `transform: translateY()` proporcional ao `window.scrollY`. Desativado em mobile (`prefers-reduced-motion` e breakpoint < 768px).
- **Leaflet:** Carregado via CDN no `listing-template.html`. O init é feito inline no template com lat/lng injetados pelo `build.py` a partir do JSON. Marcador customizado usa ícone SVG de xícara de café.
- **Build seguro:** O `build.py` usa `str.replace()` para substituir todos os `{{CHAVE}}` — nunca `eval()` ou `exec()`. Ao final do build, faz um `grep` por `{{` e reporta qualquer placeholder não substituído.
- **Dark mode:** Classe `dark` no `<html>`, toggle salvo em `localStorage('theme')`. CSS usa `:root.dark` para override de variáveis CSS.
- **Imagens:** Todas as imagens de listing são `800×600px` em formato WebP, salvas em `assets/images/listings/<slug>.webp`. O hero é `assets/images/hero/hero-bg.webp`.

---

*Documento gerado em 13/04/2026 — Template Master Directory — TechSites A.I.*
*Próximo arquivo de continuidade: `PROMPT-CONTINUIDADE-SESSAO-3.md` (criar ao final da Sessão 3)*
