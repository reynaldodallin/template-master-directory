# BLUEPRINT — Template Master Directory V2.0

> **Autor:** TechSites A.I. | **Versão:** 2.0 | **Última atualização:** 2025  
> **Piloto de referência:** [dubai.fond.coffee](https://dubai.fond.coffee) — Coffee Shop Directory em Dubai

---

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Estrutura de Arquivos](#2-estrutura-de-arquivos)
3. [Como Criar um Novo Directory (Passo a Passo)](#3-como-criar-um-novo-directory-passo-a-passo)
4. [Variações de Nicho](#4-variações-de-nicho)
5. [Personalização Visual](#5-personalização-visual)
6. [SEO & Performance](#6-seo--performance)
7. [Monetização](#7-monetização)
8. [Automação & Escalabilidade](#8-automação--escalabilidade)
9. [Checklist de Lançamento](#9-checklist-de-lançamento)
10. [Exemplos de Directories](#10-exemplos-de-directories)

---

## 1. Visão Geral do Sistema

### O que é o Template Master Directory

O **Template Master Directory** é um gerador de sites estáticos desenvolvido pela TechSites A.I. para criar sites de diretório multi-página a partir de arquivos de configuração JSON e templates HTML. O sistema não depende de banco de dados, CMS ou backend — o resultado final é HTML puro, pronto para deploy em CDN global (Cloudflare Pages).

O objetivo central é permitir que qualquer nicho (cafeterias, restaurantes, academias, produtos Amazon, etc.) em qualquer cidade do mundo seja transformado em um site de diretório profissional e funcional em menos de uma hora, reutilizando o mesmo codebase central.

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE MASTER DIRECTORY                │
│                                                             │
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────┐  │
│  │  configs/   │    │     build.py     │    │  output/  │  │
│  │ <slug>.json │───▶│  (627 linhas)    │───▶│  *.html   │  │
│  └─────────────┘    └──────────────────┘    └─────┬─────┘  │
│                              ▲                     │        │
│  ┌─────────────┐             │              ┌──────▼──────┐ │
│  │   data/     │─────────────┘              │  Cloudflare │ │
│  │ listings.   │                            │    Pages    │ │
│  │    json     │    ┌──────────────────┐    └─────────────┘ │
│  └─────────────┘    │   templates/     │                    │
│                     │  5 HTML files    │                    │
│  ┌─────────────┐    │  {{PLACEHOLDER}} │                    │
│  │   assets/   │    └──────────────────┘                    │
│  │  css + js   │                                            │
│  └─────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principais

| Componente | Função | Detalhes |
|---|---|---|
| `build.py` | Builder principal | 627 linhas, Python 3.x, gera todos os HTMLs |
| `configs/<slug>.json` | Config do diretório | ~278 keys: cores, fontes, textos, SEO, social |
| `data/<slug>/listings.json` | Dados dos estabelecimentos | Array de objetos com todos os campos do listing |
| `templates/*.html` | Templates HTML | 5 templates com sistema de `{{PLACEHOLDER}}` |
| `assets/css/style.css` | Estilo completo | Dark mode, responsivo, CSS Variables |
| `assets/js/directory.js` | JavaScript vanilla | Parallax, filtros, Leaflet maps, dark mode toggle |

### Fluxo Completo: Config → Build → Output → Deploy

```
1. CONFIGURAÇÃO
   Editar configs/<slug>.json (278 keys)
   Criar data/<slug>/listings.json
   Adicionar imagens em assets/images/

        ↓

2. BUILD
   python build.py configs/<slug>.json
   → Lê config JSON
   → Lê listings.json
   → Substitui {{PLACEHOLDERS}} nos templates
   → Gera pages para cada listing, categoria, área
   → Gera index, sitemap.xml, robots.txt

        ↓

3. OUTPUT
   output/
   ├── index.html
   ├── listing/<slug>.html   (1 por listing)
   ├── category/<slug>.html  (1 por categoria)
   ├── blog/<slug>.html      (1 por post)
   ├── about.html
   ├── contact.html
   ├── 404.html
   ├── sitemap.xml
   └── robots.txt

        ↓

4. DEPLOY
   npx wrangler pages deploy output --project-name=<nome>
   → Cloudflare Pages CDN global
   → SSL automático
   → Domínio customizado via CNAME
```

### Piloto: dubai.fond.coffee

O site piloto demonstra o sistema completo em produção:

| Parâmetro | Valor |
|---|---|
| **URL** | https://dubai.fond.coffee |
| **Nicho** | Cafeterias (Coffee Shops) |
| **Cidade** | Dubai, UAE |
| **Listings** | 5 estabelecimentos |
| **Categorias** | 5 (Specialty Coffee, Café & Bakery, etc.) |
| **Áreas** | 5 (Downtown, Marina, JBR, DIFC, Jumeirah) |
| **Deploy** | Cloudflare Pages |
| **Domínio** | Subdomínio de fond.coffee |

---

## 2. Estrutura de Arquivos

### Árvore Completa do Projeto

```
template-master-directory/
│
├── build.py                          # Builder principal (627 linhas)
│                                     # Lê config + listings, renderiza templates,
│                                     # gera sitemap.xml, robots.txt
│
├── configs/
│   ├── dubai-coffee.json             # Config piloto (Dubai coffee shops)
│   └── <slug>.json                   # Config para cada novo diretório
│
├── data/
│   └── <slug>/
│       └── listings.json             # Array com todos os listings do diretório
│
├── templates/
│   ├── index-directory.html          # Home page
│   │                                 # Hero parallax, grid de cards, filtros,
│   │                                 # seção de blog, footer
│   │
│   ├── listing-template.html         # Página individual de cada listing
│   │                                 # Mapa Leaflet, galeria, info de contato,
│   │                                 # horários, avaliações, CTA
│   │
│   ├── category-template.html        # Página de categoria
│   │                                 # Lista todos os listings de uma categoria,
│   │                                 # hero da categoria, filtros secundários
│   │
│   ├── blog-template.html            # Página de blog/artigo
│   │                                 # Suporte a conteúdo estático ou RSS,
│   │                                 # SEO otimizado para long-tail keywords
│   │
│   └── page-template.html            # Páginas genéricas
│                                     # Usado para about, contact, 404, privacy,
│                                     # terms of service
│
├── assets/
│   ├── css/
│   │   └── style.css                 # CSS completo (~1500 linhas)
│   │                                 # CSS Variables, dark mode, responsivo,
│   │                                 # grid system, componentes UI
│   │
│   ├── js/
│   │   └── directory.js              # JavaScript vanilla (~800 linhas)
│   │                                 # Parallax, filtros de listing, Leaflet maps,
│   │                                 # dark mode toggle, lazy loading, search
│   │
│   └── images/
│       ├── hero/
│       │   └── hero-bg.webp          # Imagem hero (1920×1080 WebP)
│       │                             # Cena representativa do nicho/cidade
│       │
│       ├── listings/
│       │   ├── listing-001.webp      # Foto de cada listing (800×600 WebP)
│       │   ├── listing-002.webp
│       │   └── ...
│       │
│       ├── logo.svg                  # Logo do diretório (SVG preferível)
│       ├── favicon.ico               # Favicon 32×32
│       └── og-image.jpg              # Open Graph image (1200×630 JPG)
│
└── output/                           # Gerado pelo build.py (não versionar)
    ├── index.html
    ├── listing/
    │   ├── <listing-slug>.html
    │   └── ...
    ├── category/
    │   ├── <category-slug>.html
    │   └── ...
    ├── area/
    │   ├── <area-slug>.html
    │   └── ...
    ├── blog/
    │   ├── <post-slug>.html
    │   └── ...
    ├── about.html
    ├── contact.html
    ├── 404.html
    ├── sitemap.xml
    └── robots.txt
```

### Descrição dos Arquivos-Chave

#### `build.py` — O Motor do Sistema

O script Python lê a config JSON, itera sobre os listings e renderiza cada template substituindo todos os `{{PLACEHOLDERS}}`. Funções principais:

```python
# Funções principais do build.py
def load_config(config_path)           # Carrega e valida o JSON de config
def load_listings(slug)                # Carrega listings.json do diretório
def render_template(template, data)    # Substitui {{PLACEHOLDERS}} no template
def build_index(config, listings)      # Gera index.html
def build_listing_pages(config, listings)  # Gera 1 HTML por listing
def build_category_pages(config, listings) # Gera 1 HTML por categoria
def build_area_pages(config, listings)     # Gera 1 HTML por área
def build_blog_pages(config)           # Gera páginas de blog
def build_static_pages(config)         # Gera about, contact, 404
def generate_sitemap(config, pages)    # Gera sitemap.xml
def generate_robots(config)            # Gera robots.txt
```

#### Sistema de `{{PLACEHOLDER}}`

Todos os templates usam duplas chaves para marcar onde o builder insere valores do config:

```html
<!-- Exemplo no template -->
<title>{{SEO_TITLE}} | {{DIRECTORY_NAME}}</title>
<meta name="description" content="{{SEO_DESCRIPTION}}">
<link rel="canonical" href="{{SITE_URL}}">

<h1 class="hero-title">{{HERO_HEADLINE}}</h1>
<p class="hero-sub">{{HERO_SUBHEADLINE}}</p>
```

---

## 3. Como Criar um Novo Directory (Passo a Passo)

### Etapa 1: Definir Nicho e Cidade

**1.1 — Escolher o nicho**

Pense em categorias com alta demanda de busca local e negócios dispostos a pagar por visibilidade online:

| Categoria | Exemplos de Nichos | Potencial |
|---|---|---|
| **Alimentação** | Coffee shops, pizzarias, sushi, vegan, brunch | Alto |
| **Saúde & Bem-estar** | Academias, clínicas, spas, barbearias, salões | Alto |
| **Hospedagem** | Hotéis boutique, hostels, airbnbs por região | Médio |
| **Serviços** | Pet shops, oficinas, advogados, dentistas | Alto |
| **Lazer** | Bares, clubs, coworkings, livrarias | Médio |
| **E-commerce (afiliados)** | Produtos Amazon por categoria | Alto |

**1.2 — Escolher a cidade/região**

Priorize cidades com:
- Alta densidade de negócios no nicho escolhido
- Pouca concorrência de diretórios locais
- Público com alto poder aquisitivo (converte melhor)
- Busca em inglês (maior volume global) ou mercado local forte

**1.3 — Definir o domínio**

```
# Opções de subdomínio (sistema fond.coffee / places.guide)
dubai.fond.coffee          # já em produção
lisbon.fond.coffee         # expansão temática
miami.fond.coffee

# Domínios próprios por nicho
thecoffeemap.com
dubaigyms.guide
londonpizzas.co.uk
```

---

### Etapa 2: Criar o Config JSON

**2.1 — Copiar o template base**

```bash
cp configs/dubai-coffee.json configs/<novo-slug>.json
```

**2.2 — Estrutura completa do config JSON**

O arquivo tem ~278 keys organizadas em seções lógicas. Abaixo, o template comentado completo:

```jsonc
{
  // ═══════════════════════════════════════════════
  // IDENTIDADE DO DIRETÓRIO
  // ═══════════════════════════════════════════════
  "DIRECTORY_SLUG": "lisbon-coffee",        // slug único, sem espaços, lowercase
  "DIRECTORY_NAME": "Lisbon Coffee Guide",  // nome exibido no site
  "DIRECTORY_CITY": "Lisbon",               // nome da cidade
  "DIRECTORY_COUNTRY": "Portugal",          // país
  "DIRECTORY_NICHE": "Coffee Shops",        // nicho (exibido em textos)
  "DIRECTORY_NICHE_SINGULAR": "Coffee Shop",// singular do nicho
  "DIRECTORY_EMOJI": "☕",                  // emoji temático (opcional)
  "DIRECTORY_LANGUAGE": "en",              // idioma do site (en, pt, es, etc.)
  "DIRECTORY_CURRENCY": "EUR",             // moeda local
  "DIRECTORY_PHONE_FORMAT": "+351 XXX XXX XXX", // formato de telefone

  // ═══════════════════════════════════════════════
  // URLs E DOMÍNIO
  // ═══════════════════════════════════════════════
  "SITE_URL": "https://lisbon.fond.coffee",
  "SITE_DOMAIN": "lisbon.fond.coffee",
  "CLOUDFLARE_PROJECT": "lisbon-coffee",    // nome do projeto no CF Pages

  // ═══════════════════════════════════════════════
  // CORES — PALETA DO NICHO
  // ═══════════════════════════════════════════════
  "COLOR_PRIMARY": "#6B4226",              // cor principal (ex: marrom café)
  "COLOR_PRIMARY_DARK": "#4A2E18",         // variação escura do primary
  "COLOR_PRIMARY_LIGHT": "#C8956C",        // variação clara do primary
  "COLOR_SECONDARY": "#D4A574",            // cor secundária / acento
  "COLOR_ACCENT": "#F5E6D3",              // cor de destaque suave
  "COLOR_BACKGROUND": "#FAFAF8",           // fundo da página (light mode)
  "COLOR_SURFACE": "#FFFFFF",              // fundo de cards e containers
  "COLOR_TEXT_PRIMARY": "#1A1A1A",         // texto principal
  "COLOR_TEXT_SECONDARY": "#666666",       // texto secundário / subtítulos
  "COLOR_TEXT_MUTED": "#999999",           // texto muted / placeholders
  "COLOR_BORDER": "#E8E0D8",              // bordas e divisores
  "COLOR_HERO_OVERLAY": "rgba(42,18,6,0.55)", // overlay sobre a hero image
  "COLOR_STAR": "#F4A823",                // cor das estrelas de avaliação
  "COLOR_BADGE_BG": "#FFF3E8",            // fundo dos badges de categoria
  "COLOR_BADGE_TEXT": "#6B4226",          // texto dos badges

  // Dark Mode
  "COLOR_DARK_BG": "#1A1208",
  "COLOR_DARK_SURFACE": "#2A1E10",
  "COLOR_DARK_TEXT": "#F0E8DC",
  "COLOR_DARK_BORDER": "#3D2E1A",

  // ═══════════════════════════════════════════════
  // TIPOGRAFIA
  // ═══════════════════════════════════════════════
  "FONT_HEADING": "Playfair Display",      // fonte de títulos (Google Fonts)
  "FONT_BODY": "Inter",                    // fonte do corpo do texto
  "FONT_MONO": "JetBrains Mono",           // fonte monoespacial (opcional)
  "FONT_HEADING_URL": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  "FONT_BODY_URL": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap",
  "FONT_SIZE_BASE": "16px",
  "FONT_SIZE_H1": "3.5rem",
  "FONT_SIZE_H2": "2.25rem",
  "FONT_SIZE_H3": "1.5rem",

  // ═══════════════════════════════════════════════
  // SEO — META TAGS
  // ═══════════════════════════════════════════════
  "SEO_TITLE": "Best Coffee Shops in Lisbon 2025 | Lisbon Coffee Guide",
  "SEO_DESCRIPTION": "Discover the best coffee shops in Lisbon. Expert reviews, ratings, locations and opening hours for specialty cafés, pastelarias and espresso bars.",
  "SEO_KEYWORDS": "coffee shops lisbon, best cafes lisbon, specialty coffee lisbon, where to drink coffee lisbon",
  "SEO_OG_TITLE": "Best Coffee Shops in Lisbon — Lisbon Coffee Guide",
  "SEO_OG_DESCRIPTION": "Find your perfect café in Lisbon. Curated directory with ratings, maps and reviews.",
  "SEO_OG_IMAGE": "/assets/images/og-image.jpg",
  "SEO_TWITTER_CARD": "summary_large_image",
  "SEO_TWITTER_HANDLE": "@lisboncoffee",
  "SEO_CANONICAL_URL": "https://lisbon.fond.coffee",
  "SEO_AUTHOR": "Lisbon Coffee Guide",
  "SEO_ROBOTS": "index, follow",

  // Schema.org
  "SCHEMA_TYPE": "LocalBusiness",          // ou "Product" para afiliados
  "SCHEMA_SAME_AS": [
    "https://instagram.com/lisboncoffee",
    "https://facebook.com/lisboncoffee"
  ],

  // ═══════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════
  "HERO_HEADLINE": "Discover Lisbon's Best Coffee Shops",
  "HERO_SUBHEADLINE": "Your curated guide to specialty cafés, pastelarias and espresso bars across the city",
  "HERO_CTA_PRIMARY_TEXT": "Explore Coffee Shops",
  "HERO_CTA_PRIMARY_URL": "#listings",
  "HERO_CTA_SECONDARY_TEXT": "View Map",
  "HERO_CTA_SECONDARY_URL": "#map",
  "HERO_IMAGE_PATH": "/assets/images/hero/hero-bg.webp",
  "HERO_IMAGE_ALT": "Coffee shop in Lisbon with traditional azulejo tiles",
  "HERO_BADGE_TEXT": "5-Star Rated",
  "HERO_STATS_1_NUMBER": "50+",
  "HERO_STATS_1_LABEL": "Coffee Shops",
  "HERO_STATS_2_NUMBER": "10",
  "HERO_STATS_2_LABEL": "Neighborhoods",
  "HERO_STATS_3_NUMBER": "4.7★",
  "HERO_STATS_3_LABEL": "Average Rating",

  // ═══════════════════════════════════════════════
  // NAVEGAÇÃO
  // ═══════════════════════════════════════════════
  "NAV_LOGO_TEXT": "Lisbon Coffee",
  "NAV_LOGO_IMAGE": "/assets/images/logo.svg",
  "NAV_LINK_HOME": "Home",
  "NAV_LINK_LISTINGS": "Coffee Shops",
  "NAV_LINK_CATEGORIES": "Categories",
  "NAV_LINK_BLOG": "Blog",
  "NAV_LINK_ABOUT": "About",
  "NAV_LINK_CONTACT": "Contact",
  "NAV_CTA_TEXT": "Add Your Café",
  "NAV_CTA_URL": "/contact.html",

  // ═══════════════════════════════════════════════
  // CATEGORIAS
  // ═══════════════════════════════════════════════
  "CATEGORIES": [
    {
      "slug": "specialty-coffee",
      "name": "Specialty Coffee",
      "icon": "☕",
      "description": "Third-wave specialty coffee shops with single-origin beans",
      "color": "#6B4226"
    },
    {
      "slug": "pastelaria",
      "name": "Pastelaria & Café",
      "icon": "🥐",
      "description": "Traditional Portuguese pastelarias with espresso",
      "color": "#D4A574"
    },
    {
      "slug": "brunch",
      "name": "Brunch & Coffee",
      "icon": "🍳",
      "description": "Brunch spots with excellent coffee programs",
      "color": "#8BC34A"
    },
    {
      "slug": "coworking-cafe",
      "name": "Work-Friendly Café",
      "icon": "💻",
      "description": "Cafés with fast WiFi and laptop-friendly seating",
      "color": "#2196F3"
    },
    {
      "slug": "roastery",
      "name": "Roastery",
      "icon": "🔥",
      "description": "In-house roasters selling fresh beans",
      "color": "#FF5722"
    }
  ],

  // ═══════════════════════════════════════════════
  // ÁREAS / BAIRROS
  // ═══════════════════════════════════════════════
  "AREAS": [
    { "slug": "baixa-chiado",  "name": "Baixa & Chiado",  "lat": 38.7139, "lng": -9.1400 },
    { "slug": "alfama",        "name": "Alfama",           "lat": 38.7139, "lng": -9.1300 },
    { "slug": "principe-real", "name": "Príncipe Real",    "lat": 38.7170, "lng": -9.1480 },
    { "slug": "belem",         "name": "Belém",            "lat": 38.6970, "lng": -9.2060 },
    { "slug": "intendente",    "name": "Intendente",       "lat": 38.7218, "lng": -9.1340 }
  ],

  // ═══════════════════════════════════════════════
  // MAPA (LEAFLET)
  // ═══════════════════════════════════════════════
  "MAP_CENTER_LAT": "38.7139",
  "MAP_CENTER_LNG": "-9.1400",
  "MAP_DEFAULT_ZOOM": "13",
  "MAP_TILE_PROVIDER": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "MAP_ATTRIBUTION": "© OpenStreetMap contributors",
  "MAP_MARKER_COLOR": "#6B4226",
  "MAP_ENABLED": true,                     // false para sites de afiliados

  // ═══════════════════════════════════════════════
  // TEXTOS DE UI — LISTINGS
  // ═══════════════════════════════════════════════
  "UI_LISTINGS_SECTION_TITLE": "Coffee Shops in Lisbon",
  "UI_LISTINGS_SECTION_SUBTITLE": "Curated picks from across the city",
  "UI_FILTER_ALL": "All",
  "UI_FILTER_BY_CATEGORY": "Filter by Category",
  "UI_FILTER_BY_AREA": "Filter by Area",
  "UI_SEARCH_PLACEHOLDER": "Search coffee shops...",
  "UI_SORT_BY": "Sort by",
  "UI_SORT_RATING": "Rating",
  "UI_SORT_REVIEWS": "Most Reviewed",
  "UI_SORT_NAME": "Name A-Z",
  "UI_CARD_REVIEWS_LABEL": "reviews",
  "UI_CARD_CTA": "View Details",
  "UI_CARD_WEBSITE_CTA": "Visit Website",
  "UI_NO_RESULTS": "No coffee shops found. Try adjusting your filters.",

  // ═══════════════════════════════════════════════
  // TEXTOS DE UI — LISTING INDIVIDUAL
  // ═══════════════════════════════════════════════
  "UI_LISTING_ADDRESS_LABEL": "Address",
  "UI_LISTING_PHONE_LABEL": "Phone",
  "UI_LISTING_HOURS_LABEL": "Opening Hours",
  "UI_LISTING_WEBSITE_LABEL": "Website",
  "UI_LISTING_RATING_LABEL": "Google Rating",
  "UI_LISTING_CATEGORY_LABEL": "Category",
  "UI_LISTING_AREA_LABEL": "Neighborhood",
  "UI_LISTING_CTA_WEBSITE": "Visit Website",
  "UI_LISTING_CTA_DIRECTIONS": "Get Directions",
  "UI_LISTING_CTA_WHATSAPP": "Contact on WhatsApp",
  "UI_LISTING_CTA_CLAIM": "Own this business? Claim your website",
  "UI_LISTING_MAP_TITLE": "Location",
  "UI_LISTING_BACK_LINK": "← Back to all coffee shops",
  "UI_LISTING_RELATED_TITLE": "More Coffee Shops Nearby",

  // ═══════════════════════════════════════════════
  // TEXTOS DE UI — BLOG
  // ═══════════════════════════════════════════════
  "UI_BLOG_SECTION_TITLE": "From the Blog",
  "UI_BLOG_SECTION_SUBTITLE": "Tips, guides and coffee culture in Lisbon",
  "UI_BLOG_READ_MORE": "Read More",
  "UI_BLOG_BACK_LINK": "← Back to Blog",
  "UI_BLOG_AUTHOR_LABEL": "By",
  "UI_BLOG_DATE_LABEL": "Published on",
  "UI_BLOG_CATEGORY_LABEL": "Category",

  // ═══════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════
  "FOOTER_TAGLINE": "Your trusted guide to Lisbon's coffee scene.",
  "FOOTER_ABOUT_LINK_TEXT": "About Us",
  "FOOTER_CONTACT_LINK_TEXT": "Contact",
  "FOOTER_PRIVACY_LINK_TEXT": "Privacy Policy",
  "FOOTER_TERMS_LINK_TEXT": "Terms of Use",
  "FOOTER_SITEMAP_LINK_TEXT": "Sitemap",
  "FOOTER_COPYRIGHT": "© 2025 Lisbon Coffee Guide. All rights reserved.",
  "FOOTER_MADE_WITH": "Made with ☕ by TechSites A.I.",

  // ═══════════════════════════════════════════════
  // REDES SOCIAIS
  // ═══════════════════════════════════════════════
  "SOCIAL_INSTAGRAM": "https://instagram.com/lisboncoffee",
  "SOCIAL_FACEBOOK": "https://facebook.com/lisboncoffee",
  "SOCIAL_TWITTER": "https://twitter.com/lisboncoffee",
  "SOCIAL_PINTEREST": "",
  "SOCIAL_TIKTOK": "",
  "SOCIAL_WHATSAPP_NUMBER": "+351910000000",  // para CTA de prospecção

  // ═══════════════════════════════════════════════
  // ABOUT PAGE
  // ═══════════════════════════════════════════════
  "ABOUT_TITLE": "About Lisbon Coffee Guide",
  "ABOUT_SUBTITLE": "Who we are and what we do",
  "ABOUT_BODY": "Lisbon Coffee Guide is an independent directory...",

  // ═══════════════════════════════════════════════
  // CONTACT PAGE
  // ═══════════════════════════════════════════════
  "CONTACT_TITLE": "Get in Touch",
  "CONTACT_SUBTITLE": "Want to list your café? We'd love to hear from you.",
  "CONTACT_EMAIL": "hello@lisbon.fond.coffee",
  "CONTACT_WHATSAPP": "+351910000000",
  "CONTACT_FORM_ENABLED": false,           // form estático, sem backend

  // ═══════════════════════════════════════════════
  // GOOGLE ANALYTICS / TRACKING
  // ═══════════════════════════════════════════════
  "GA_MEASUREMENT_ID": "G-XXXXXXXXXX",
  "GTM_ID": "",
  "CLARITY_ID": "",
  "HOTJAR_ID": ""
}
```

---

### Etapa 3: Criar o Arquivo de Listings

**3.1 — Estrutura do arquivo `data/<slug>/listings.json`**

```json
[
  {
    "id": "001",
    "slug": "dear-breakfast-lisbon",
    "name": "Dear Breakfast",
    "category": "brunch",
    "area": "principe-real",
    "address": "R. do Século 19, 1200-433 Lisboa",
    "phone": "+351 21 342 5858",
    "google_rating": 4.6,
    "google_reviews": 1840,
    "google_place_id": "ChIJXXXXXXXXXXXXXXXX",
    "lat": 38.7178,
    "lng": -9.1493,
    "photo_url": "/assets/images/listings/dear-breakfast.webp",
    "description": "Charming all-day brunch spot in Príncipe Real with excellent filter coffee and weekend queues. Known for their avocado toast and specialty lattes.",
    "hours": {
      "monday":    "08:00–17:00",
      "tuesday":   "08:00–17:00",
      "wednesday": "08:00–17:00",
      "thursday":  "08:00–17:00",
      "friday":    "08:00–18:00",
      "saturday":  "09:00–18:00",
      "sunday":    "09:00–17:00"
    },
    "tags": ["brunch", "specialty coffee", "vegetarian-friendly", "instagram-worthy"],
    "has_website": true,
    "website_url": "https://dearbreakfast.pt",
    "site_built": false,
    "site_url": "",
    "prospect_status": "not_contacted",
    "whatsapp": "",
    "instagram": "@dearbreakfast",
    "price_level": "$$",
    "wifi": true,
    "pet_friendly": false,
    "outdoor_seating": true,
    "featured": true
  }
]
```

**3.2 — Campos obrigatórios vs. opcionais**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | ✅ | ID único numérico |
| `slug` | string | ✅ | URL-friendly name |
| `name` | string | ✅ | Nome do estabelecimento |
| `category` | string | ✅ | Deve corresponder a um slug em CATEGORIES |
| `area` | string | ✅ | Deve corresponder a um slug em AREAS |
| `lat`, `lng` | float | ✅ | Coordenadas para o mapa Leaflet |
| `google_rating` | float | ✅ | Nota de 1.0 a 5.0 |
| `google_reviews` | int | ✅ | Número de avaliações |
| `photo_url` | string | ✅ | Path relativo da imagem |
| `description` | string | ✅ | Descrição do listing |
| `hours` | object | Recomendado | Horários de funcionamento |
| `google_place_id` | string | Recomendado | Para deep link no Google Maps |
| `has_website` | boolean | Recomendado | Se o negócio tem site |
| `site_built` | boolean | Interno | Se já criamos site para ele |
| `prospect_status` | string | Interno | CRM básico de prospecção |

**3.3 — Como coletar os listings**

**Opção A — Manual (5–10 listings):**
1. Pesquisar no Google Maps: `"coffee shops" in Lisbon`
2. Copiar dados manualmente de cada listagem
3. Usar Google Maps API para obter `google_place_id`, `lat`, `lng`

**Opção B — Automação com n8n + Google Places API:**
```
n8n workflow:
1. HTTP Request → Google Places API (Text Search)
   URL: https://maps.googleapis.com/maps/api/place/textsearch/json
   Params: query="coffee shops in Lisbon", key=API_KEY

2. Loop → Para cada resultado:
   - HTTP Request → Place Details API
   - Extrair: name, address, phone, rating, reviews, place_id, lat, lng

3. Transform → Formatar como objeto listings.json

4. Write File → data/<slug>/listings.json
```

---

### Etapa 4: Preparar as Imagens

**4.1 — Especificações de imagem**

| Tipo | Dimensões | Formato | Tamanho máx. | Local |
|---|---|---|---|---|
| Hero background | 1920×1080px | WebP | 300 KB | `assets/images/hero/hero-bg.webp` |
| Listing photo | 800×600px | WebP | 80 KB | `assets/images/listings/<slug>.webp` |
| OG Image | 1200×630px | JPG | 150 KB | `assets/images/og-image.jpg` |
| Logo | Variável | SVG | 10 KB | `assets/images/logo.svg` |
| Favicon | 32×32px | ICO | 5 KB | `assets/images/favicon.ico` |

**4.2 — Script de processamento com Pillow**

```python
from PIL import Image
import os

def process_hero(input_path, output_path):
    """Redimensiona e converte hero para WebP 1920x1080"""
    img = Image.open(input_path)
    img = img.convert("RGB")
    img = img.resize((1920, 1080), Image.LANCZOS)
    img.save(output_path, "WEBP", quality=85, optimize=True)

def process_listing_image(input_path, output_path):
    """Redimensiona e converte listing para WebP 800x600 com crop central"""
    img = Image.open(input_path)
    img = img.convert("RGB")

    # Crop centralizado para manter proporção 4:3
    target_ratio = 4 / 3
    w, h = img.size
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, h))
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        img = img.crop((0, offset, w, offset + new_h))

    img = img.resize((800, 600), Image.LANCZOS)
    img.save(output_path, "WEBP", quality=82, optimize=True)

# Processar todas as imagens de uma pasta
input_folder = "raw_images/"
output_folder = "assets/images/listings/"

for filename in os.listdir(input_folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        slug = filename.rsplit(".", 1)[0]
        process_listing_image(
            os.path.join(input_folder, filename),
            os.path.join(output_folder, f"{slug}.webp")
        )
        print(f"✅ Processed: {slug}.webp")
```

---

### Etapa 5: Build e Preview Local

```bash
# Gerar o site
python build.py configs/lisbon-coffee.json

# Output esperado:
# ✅ Config loaded: lisbon-coffee
# ✅ Listings loaded: 12 items
# 📄 Building index.html...
# 📄 Building 12 listing pages...
# 📄 Building 5 category pages...
# 📄 Building 5 area pages...
# 📄 Building 3 blog pages...
# 📄 Building static pages (about, contact, 404)...
# 🗺  Generating sitemap.xml (28 URLs)...
# 🤖 Generating robots.txt...
# ✅ Build complete! 31 files in ./output/

# Preview local
cd output
python -m http.server 8080

# Abrir no browser: http://localhost:8080
```

**Verificar:**
- [ ] Home page carrega com hero e listings
- [ ] Filtros de categoria e área funcionam
- [ ] Páginas individuais de listing abrem
- [ ] Mapa Leaflet carrega nos listings
- [ ] Dark mode toggle funciona
- [ ] Versão mobile está responsiva

---

### Etapa 6: Deploy no Cloudflare Pages

```bash
# Instalar Wrangler (se ainda não tiver)
npm install -g wrangler

# Autenticar com Cloudflare
npx wrangler login

# Criar projeto (apenas na primeira vez)
npx wrangler pages project create lisbon-coffee

# Deploy
npx wrangler pages deploy output --project-name=lisbon-coffee

# Output esperado:
# 🌍 Uploading... (31 files)
# ✨ Success! Deployed to:
#    https://lisbon-coffee.pages.dev
```

**Configurações adicionais no Cloudflare Dashboard:**
- Ativar "Always Use HTTPS"
- Configurar Headers de Cache para assets estáticos
- Ativar Minification (HTML, CSS, JS)

---

### Etapa 7: Configurar DNS no Cloudflare

```
# No Cloudflare DNS (domínio fond.coffee):

Tipo  | Nome    | Conteúdo                      | Proxy
CNAME | lisbon  | lisbon-coffee.pages.dev       | ✅ Proxied

# Resultado: https://lisbon.fond.coffee
```

**SSL/TLS:**
- Configuração: **Full (strict)**
- Certificate: Cloudflare Universal SSL (automático, gratuito)
- HSTS: Ativado

---

## 4. Variações de Nicho

### 4.1 — Directory de Cidade (Genérico)

Sites de diretório local por cidade, aceitando múltiplos tipos de negócio.

| Parâmetro | Configuração |
|---|---|
| **Categorias** | Restaurants, Bars, Gyms, Salons, Hotels, Shops |
| **Paleta** | Neutra — azul/cinza ou verde/bege |
| **Fonte** | Inter (heading) + Inter (body) — clean |
| **Mapa** | Ativado, zoom 12 |
| **CTA principal** | "Explore [Cidade]" |

```json
"COLOR_PRIMARY": "#2563EB",
"COLOR_SECONDARY": "#16A34A",
"FONT_HEADING": "Inter",
"FONT_BODY": "Inter"
```

---

### 4.2 — Directory de Nicho Vertical

Sites temáticos de alta conversão com paleta visual do nicho.

| Nicho | Paleta sugerida | Fonte heading | Ícone |
|---|---|---|---|
| ☕ Coffee | Browns: `#6B4226`, `#C8956C` | Playfair Display | ☕ |
| 🍕 Pizza | Reds/yellows: `#D32F2F`, `#FF8F00` | Oswald | 🍕 |
| 🍣 Sushi | Black/red: `#1A1A1A`, `#E53935` | Noto Serif JP | 🍣 |
| 🥗 Vegan | Greens: `#2E7D32`, `#A5D6A7` | Raleway | 🌿 |
| 🍺 Craft Beer | Ambers: `#E65100`, `#FFB300` | Bebas Neue | 🍺 |
| 💈 Barbearia | Navy/gold: `#1A237E`, `#F9A825` | Montserrat | ✂️ |
| 🐾 Pet Shop | Warm: `#FF7043`, `#FFCCBC` | Nunito | 🐾 |
| 🏋️ Academia | Dark/neon: `#212121`, `#00E5FF` | Barlow | 💪 |

---

### 4.3 — Directory de Afiliados Amazon

Adaptar o sistema para produtos em vez de locais físicos. Ideal para nichos como "Best Coffee Makers", "Top Espresso Machines", "Kitchen Gadgets".

**Diferenças em relação ao directory local:**

| Parâmetro | Directory Local | Directory Afiliados |
|---|---|---|
| `MAP_ENABLED` | `true` | `false` |
| `lat`, `lng` | Coordenadas GPS | Não necessário (usar `0`) |
| `google_place_id` | ID do Google Maps | ASIN da Amazon |
| `google_rating` | Nota Google | Nota Amazon (1–5) |
| `google_reviews` | Reviews Google | Reviews Amazon |
| `address` | Endereço físico | Não exibido |
| `phone` | Telefone | Não exibido |
| `hours` | Horário de func. | Não exibido |
| `website_url` | Site do negócio | Link de afiliado Amazon |
| `UI_CARD_CTA` | "View Details" | "Ver na Amazon" |
| `UI_LISTING_CTA_WEBSITE` | "Visit Website" | "Comprar na Amazon" |
| `SCHEMA_TYPE` | `LocalBusiness` | `Product` |

**Config especial para afiliados:**

```json
"MAP_ENABLED": false,
"AMAZON_AFFILIATE_TAG": "yourtag-20",
"UI_CARD_CTA": "Ver na Amazon",
"UI_LISTING_CTA_WEBSITE": "🛒 Comprar na Amazon",
"UI_LISTING_ADDRESS_LABEL": "Marca",
"UI_LISTING_PHONE_LABEL": "Modelo",
"UI_LISTING_RATING_LABEL": "Avaliação Amazon",
"SCHEMA_TYPE": "Product",
"DIRECTORY_NICHE": "Coffee Makers",
"DIRECTORY_NICHE_SINGULAR": "Coffee Maker"
```

**Listing de produto (estrutura adaptada):**

```json
{
  "id": "001",
  "slug": "breville-barista-express",
  "name": "Breville Barista Express BES870XL",
  "category": "espresso-machines",
  "area": "under-500",
  "address": "Breville",
  "phone": "BES870XL",
  "google_rating": 4.5,
  "google_reviews": 12847,
  "google_place_id": "B00LBH2D1E",
  "lat": 0,
  "lng": 0,
  "photo_url": "/assets/images/listings/breville-barista-express.webp",
  "description": "All-in-one espresso machine with integrated grinder...",
  "hours": {},
  "has_website": true,
  "website_url": "https://amazon.com/dp/B00LBH2D1E?tag=yourtag-20",
  "tags": ["espresso", "grinder", "semi-automatic", "bestseller"],
  "featured": true
}
```

**Exemplos de directories de afiliados:**

- `best-coffee-makers.guide` — as melhores máquinas de café
- `top-espresso-machines.com` — máquinas de espresso por faixa de preço
- `kitchen-gadgets.review` — gadgets de cozinha
- `best-headphones.guide` — fones de ouvido por categoria
- `laptop-deals.today` — notebooks por uso/orçamento

---

## 5. Personalização Visual

### CSS Variables

Todas as cores e tokens de design são controladas por CSS Variables no `:root`, tornando a personalização trivial:

```css
/* assets/css/style.css — Seção de variables */
:root {
  /* Cores — preenchidas pelo build.py a partir do config */
  --color-primary:       {{COLOR_PRIMARY}};
  --color-primary-dark:  {{COLOR_PRIMARY_DARK}};
  --color-primary-light: {{COLOR_PRIMARY_LIGHT}};
  --color-secondary:     {{COLOR_SECONDARY}};
  --color-accent:        {{COLOR_ACCENT}};
  --color-bg:            {{COLOR_BACKGROUND}};
  --color-surface:       {{COLOR_SURFACE}};
  --color-text:          {{COLOR_TEXT_PRIMARY}};
  --color-text-muted:    {{COLOR_TEXT_MUTED}};
  --color-border:        {{COLOR_BORDER}};
  --color-star:          {{COLOR_STAR}};

  /* Tipografia */
  --font-heading: '{{FONT_HEADING}}', Georgia, serif;
  --font-body:    '{{FONT_BODY}}', system-ui, sans-serif;

  /* Espaçamentos */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.12);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.16);

  /* Transições */
  --transition: all 0.2s ease;
}

/* Dark mode automático */
[data-theme="dark"] {
  --color-bg:       {{COLOR_DARK_BG}};
  --color-surface:  {{COLOR_DARK_SURFACE}};
  --color-text:     {{COLOR_DARK_TEXT}};
  --color-border:   {{COLOR_DARK_BORDER}};
}
```

### Dark Mode

O dark mode é ativado via atributo `data-theme="dark"` no `<html>` e toggleado pelo botão na navbar:

```javascript
// assets/js/directory.js
const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
};

// Respeitar preferência do sistema na primeira visita
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
document.documentElement.setAttribute(
  'data-theme',
  savedTheme || (prefersDark ? 'dark' : 'light')
);
```

### Hero Parallax

```javascript
// Efeito parallax no hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg');
  if (hero) {
    const scrollY = window.scrollY;
    hero.style.transform = `translateY(${scrollY * 0.4}px)`;
  }
});
```

Para trocar a imagem do hero, basta substituir `assets/images/hero/hero-bg.webp` e recriar o build. A imagem deve ter 1920×1080px e boa profundidade de campo.

### Leaflet: Configuração do Mapa

```javascript
// Inicialização do mapa na página de listing
const map = L.map('map-container', {
  center: [{{LISTING_LAT}}, {{LISTING_LNG}}],
  zoom: 16,
  zoomControl: true,
  scrollWheelZoom: false   // Evita scroll acidental na página
});

L.tileLayer('{{MAP_TILE_PROVIDER}}', {
  attribution: '{{MAP_ATTRIBUTION}}'
}).addTo(map);

// Marker personalizado com cor do nicho
const markerIcon = L.divIcon({
  html: `<div class="custom-marker" style="background:{{MAP_MARKER_COLOR}}">{{DIRECTORY_EMOJI}}</div>`,
  className: '',
  iconSize: [40, 40]
});

L.marker([{{LISTING_LAT}}, {{LISTING_LNG}}], { icon: markerIcon })
  .addTo(map)
  .bindPopup('<b>{{LISTING_NAME}}</b><br>{{LISTING_ADDRESS}}')
  .openPopup();
```

---

## 6. SEO & Performance

### Schema.org — Dados Estruturados

O `build.py` gera Schema.org automaticamente para cada página:

```html
<!-- Na home page: ItemList Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{SEO_TITLE}}",
  "description": "{{SEO_DESCRIPTION}}",
  "url": "{{SITE_URL}}",
  "numberOfItems": {{TOTAL_LISTINGS}},
  "itemListElement": [
    {{#each listings}}
    {
      "@type": "ListItem",
      "position": {{@index}},
      "item": {
        "@type": "{{SCHEMA_TYPE}}",
        "name": "{{name}}",
        "url": "{{SITE_URL}}/listing/{{slug}}.html",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "{{google_rating}}",
          "reviewCount": "{{google_reviews}}"
        }
      }
    }
    {{/each}}
  ]
}
</script>

<!-- Em cada listing page: LocalBusiness Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "{{SCHEMA_TYPE}}",
  "name": "{{LISTING_NAME}}",
  "image": "{{LISTING_PHOTO_URL}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{LISTING_ADDRESS}}"
  },
  "telephone": "{{LISTING_PHONE}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{LISTING_RATING}}",
    "reviewCount": "{{LISTING_REVIEWS}}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{{LISTING_LAT}}",
    "longitude": "{{LISTING_LNG}}"
  },
  "openingHoursSpecification": [...]
}
</script>
```

### Sitemap.xml Auto-gerado

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{{SITE_URL}}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Listing pages: priority 0.8 -->
  <!-- Category pages: priority 0.7 -->
  <!-- Area pages: priority 0.7 -->
  <!-- Blog pages: priority 0.6 -->
  <!-- Static pages: priority 0.5 -->
</urlset>
```

### Open Graph & Twitter Cards

```html
<!-- Em todos os templates -->
<meta property="og:title"       content="{{SEO_OG_TITLE}}">
<meta property="og:description" content="{{SEO_OG_DESCRIPTION}}">
<meta property="og:image"       content="{{SITE_URL}}{{SEO_OG_IMAGE}}">
<meta property="og:url"         content="{{PAGE_CANONICAL_URL}}">
<meta property="og:type"        content="website">
<meta property="og:site_name"   content="{{DIRECTORY_NAME}}">

<meta name="twitter:card"        content="{{SEO_TWITTER_CARD}}">
<meta name="twitter:site"        content="{{SEO_TWITTER_HANDLE}}">
<meta name="twitter:title"       content="{{SEO_OG_TITLE}}">
<meta name="twitter:description" content="{{SEO_OG_DESCRIPTION}}">
<meta name="twitter:image"       content="{{SITE_URL}}{{SEO_OG_IMAGE}}">
```

### Performance

| Técnica | Implementação | Impacto |
|---|---|---|
| **WebP images** | PIL convert na Etapa 4 | -60% tamanho de imagem |
| **Lazy loading** | `loading="lazy"` em `<img>` | Carregamento inicial mais rápido |
| **CSS Variables** | Sem JS para theming | Sem FOUC |
| **Preconnect** | `<link rel="preconnect">` para Google Fonts | -100ms latência |
| **HTML minificado** | Opcional via htmlmin no build | -5% tamanho |
| **Cloudflare CDN** | Deploy no CF Pages | <50ms TTFB global |
| **Cache headers** | 1 ano para assets hash, 1 hora para HTML | Cache eficiente |

```html
<!-- Preconnect para Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## 7. Monetização

### Modelo Principal: Listing Grátis → Site Premium

O directory é gratuito para o negócio ser listado, mas o negócio recebe um CTA na sua página de listing:

```
┌────────────────────────────────────────────────────────┐
│  📢 Own this business?                                  │
│                                                        │
│  Get a professional website built from your listing.  │
│  Starting from $29/month. WhatsApp us to claim.       │
│                                                        │
│  [💬 Claim on WhatsApp]                                │
└────────────────────────────────────────────────────────┘
```

**Fluxo de prospecção:**

```
1. Listing criado no diretório (grátis para o negócio)
2. Campo "prospect_status": "not_contacted" no listings.json
3. n8n detecta listings não contatados
4. Envia mensagem automática no WhatsApp:
   "Olá! Seu café [NOME] já está listado em [SITE].
   Gostaria de ter um site profissional para seu negócio?
   Clique aqui para saber mais: [link]"
5. Prospect responde → entra no pipeline de vendas
6. Site criado → "site_built": true, "prospect_status": "client"
```

**Campos de CRM no listings.json:**

| Campo | Valores possíveis |
|---|---|
| `prospect_status` | `not_contacted`, `contacted`, `interested`, `negotiating`, `client`, `declined` |
| `site_built` | `true` / `false` |
| `site_url` | URL do site criado para o negócio |

### Monetização via Afiliados Amazon

Para directories de produtos:

```
Comissão Amazon Associates:
- Categoria Electronics:  3%
- Categoria Kitchen:      4.5%
- Categoria Coffee/Food:  4%

Exemplo prático:
- Espresso machine $400 × 4% = $16 por venda
- 10 vendas/dia = $160/dia = ~$4.800/mês
- Com SEO orgânico + Pinterest/YouTube = escala
```

**Estratégia de conteúdo para afiliados:**
1. Blog posts: "Best [Produto] Under $[Preço]" (top-of-funnel)
2. Comparison pages: "[Produto A] vs [Produto B]" (mid-funnel)
3. Listing pages com botão "Comprar na Amazon" (bottom-of-funnel)

---

## 8. Automação & Escalabilidade

### n8n Workflow — Coletar Listings via Google Places

```yaml
# Workflow: collect-listings.json (n8n)

Nodes:
  1. Trigger: Manual ou Schedule (semanal)

  2. HTTP Request (Google Places Text Search):
     URL: https://maps.googleapis.com/maps/api/place/textsearch/json
     Params:
       query: "{{NICHE}} in {{CITY}}"
       key: {{GOOGLE_PLACES_API_KEY}}
       type: {{PLACE_TYPE}}  # cafe, restaurant, gym, etc.

  3. Loop (para cada resultado):

  4. HTTP Request (Google Places Details):
     URL: https://maps.googleapis.com/maps/api/place/details/json
     Params:
       place_id: {{place_id}}
       fields: name,formatted_address,formatted_phone_number,
               opening_hours,rating,user_ratings_total,
               website,photos,geometry,url
       key: {{GOOGLE_PLACES_API_KEY}}

  5. Code Node (Transform):
     // Mapear campos do Google Places para formato listings.json
     return {
       id: String(index + 1).padStart(3, '0'),
       slug: slugify(result.name),
       name: result.name,
       address: result.formatted_address,
       phone: result.formatted_phone_number || '',
       google_rating: result.rating,
       google_reviews: result.user_ratings_total,
       lat: result.geometry.location.lat,
       lng: result.geometry.location.lng,
       // ...
     }

  6. Aggregate: Juntar todos em array

  7. Write Binary File: data/<slug>/listings.json
```

### Meta-escalabilidade: 1 Directory por Hora

Com experiência no sistema, o fluxo completo para um novo diretório:

| Etapa | Tempo estimado |
|---|---|
| Definir nicho + cidade + domínio | 5 min |
| Clonar config JSON e editar keys | 15 min |
| Rodar n8n para coletar 10–20 listings | 10 min |
| Revisar e ajustar listings.json | 10 min |
| Coletar + processar imagens | 10 min |
| Build + preview + correções | 5 min |
| Deploy Cloudflare Pages + DNS | 5 min |
| **Total** | **~60 min** |

### Templates Reutilizáveis

O mesmo `build.py` e os mesmos templates HTML funcionam para qualquer nicho. A diferença é 100% no arquivo de config. Para criar um novo diretório:

```bash
# Uma linha para criar um novo diretório
cp configs/dubai-coffee.json configs/lisbon-coffee.json
# Editar lisbon-coffee.json com 278 keys do novo nicho
# Criar data/lisbon-coffee/listings.json
python build.py configs/lisbon-coffee.json
```

---

## 9. Checklist de Lançamento

### Pré-build

- [ ] Nicho e cidade definidos
- [ ] Domínio escolhido e configurado no Cloudflare
- [ ] Config JSON criado (`configs/<slug>.json`)
- [ ] Todas as 278 keys do config preenchidas
- [ ] `DIRECTORY_SLUG` único e sem conflitos
- [ ] Cores do nicho definidas e testadas (verificar contraste WCAG)
- [ ] Fontes do Google Fonts selecionadas
- [ ] Categorias (mínimo 3) definidas com slugs únicos
- [ ] Áreas/bairros (mínimo 3) definidas com coordenadas corretas
- [ ] Coordenadas centrais do mapa validadas (`MAP_CENTER_LAT`, `MAP_CENTER_LNG`)
- [ ] Textos de UI traduzidos/adaptados ao idioma do site
- [ ] SEO title (< 60 caracteres) e description (< 160 caracteres) revisados
- [ ] Social media handles configurados (ou deixados vazios)
- [ ] Google Analytics ID configurado (ou string vazia)

### Listings

- [ ] `data/<slug>/listings.json` criado
- [ ] Mínimo de 5 listings para lançamento
- [ ] Todos os slugs dos listings são únicos
- [ ] Todas as categorias dos listings existem no config CATEGORIES
- [ ] Todas as áreas dos listings existem no config AREAS
- [ ] Coordenadas lat/lng validadas (não são `0,0` — exceto para afiliados)
- [ ] `google_rating` entre 1.0 e 5.0
- [ ] `google_reviews` é inteiro positivo
- [ ] Descrições com mínimo de 50 caracteres cada
- [ ] Horários de funcionamento preenchidos (ou objeto vazio `{}`)
- [ ] Campo `prospect_status` definido para todos

### Imagens

- [ ] Hero image: 1920×1080px, WebP, < 300KB
- [ ] Imagem para cada listing: 800×600px, WebP, < 80KB
- [ ] OG image: 1200×630px, JPG, < 150KB
- [ ] Logo: SVG ou PNG com fundo transparente
- [ ] Favicon: ICO 32×32px
- [ ] Alt text configurado para todas as imagens (`HERO_IMAGE_ALT`)

### Build

- [ ] `python build.py configs/<slug>.json` executa sem erros
- [ ] Número de arquivos gerado conforme esperado
- [ ] `sitemap.xml` gerado com todas as URLs
- [ ] `robots.txt` gerado corretamente
- [ ] Preview local (http://localhost:8080) funcional

### QA Visual (Preview Local)

- [ ] Hero carrega com parallax
- [ ] Listings aparecem na grade
- [ ] Filtros de categoria funcionam
- [ ] Filtros de área funcionam
- [ ] Campo de busca filtra listings
- [ ] Cards têm imagem, nome, categoria, rating, botão CTA
- [ ] Páginas individuais de listing abrem
- [ ] Mapa Leaflet carrega (para directories locais)
- [ ] Seção de horários exibida corretamente
- [ ] Dark mode toggle funciona
- [ ] Layout responsivo no mobile (≤ 375px)
- [ ] Páginas About, Contact e 404 funcionam
- [ ] Links do menu navegam corretamente
- [ ] Footer com links corretos

### SEO

- [ ] `<title>` único em cada página
- [ ] `<meta description>` único em cada página
- [ ] `<link rel="canonical">` configurado
- [ ] Open Graph tags presentes e corretas
- [ ] Schema.org válido (testar em: https://validator.schema.org)
- [ ] Sitemap.xml acessível em `/sitemap.xml`
- [ ] `robots.txt` permite crawl
- [ ] Imagens com `alt` text
- [ ] Headings hierarquia H1 > H2 > H3 respeitada

### Deploy

- [ ] `npx wrangler pages deploy output` executado sem erros
- [ ] Site acessível em `<projeto>.pages.dev`
- [ ] CNAME configurado no Cloudflare DNS
- [ ] Domínio customizado acessível em HTTPS
- [ ] SSL Full (strict) ativado
- [ ] Redirecionamento de HTTP para HTTPS funcionando
- [ ] Página 404 customizada retornando status 404
- [ ] Assets carregando sem erros no console

### Pós-lançamento

- [ ] Google Search Console: propriedade criada e sitemap enviado
- [ ] Google Analytics: verificar recebimento de dados
- [ ] Social media: perfis criados e link do site adicionado
- [ ] Primeiros 5 negócios contatados via WhatsApp
- [ ] Directory indexado no Google (verificar com `site:<domínio>`)

---

## 10. Exemplos de Directories

### Directories Já Planejados ou em Produção

| # | Nome do Site | Domínio | Nicho | Cidade | Status |
|---|---|---|---|---|---|
| 1 | Dubai Coffee Guide | dubai.fond.coffee | Coffee Shops | Dubai, UAE | ✅ Produção |
| 2 | Lisbon Coffee Guide | lisbon.fond.coffee | Coffee Shops | Lisboa, PT | 🔄 Planejado |
| 3 | Tokyo Ramen Guide | tokyo.ramen.guide | Ramen Restaurants | Tóquio, JP | 🔄 Planejado |
| 4 | Miami Fitness Guide | miami.gyms.guide | Academias | Miami, EUA | 🔄 Planejado |
| 5 | London Brunch Guide | london.brunch.guide | Brunch Cafés | Londres, UK | 🔄 Planejado |
| 6 | Barcelona Tapas | barcelona.tapas.guide | Tapas Bars | Barcelona, ES | 🔄 Planejado |
| 7 | NYC Coworking Spots | nyc.cowork.guide | Coworkings | Nova York, EUA | 🔄 Planejado |
| 8 | Bali Villas Directory | bali.villas.guide | Hospedagem | Bali, ID | 🔄 Planejado |
| 9 | Best Coffee Makers | bestcoffeemakers.guide | Afiliados Amazon | Global | 🔄 Planejado |
| 10 | São Paulo Pet Shops | sp.petshops.guide | Pet Shops | São Paulo, BR | 🔄 Planejado |
| 11 | Sydney Surf Shops | sydney.surf.guide | Surf Shops | Sydney, AU | 🔄 Planejado |
| 12 | Medellín Hostels | medellin.hostels.guide | Hostels | Medellín, CO | 🔄 Planejado |

### Matriz de Potencial por Nicho

| Nicho | Volume de Busca | Competição | RPM (afiliados) | Facilidade de prospecção |
|---|---|---|---|---|
| Coffee Shops | 🔥 Alto | 🟡 Médio | N/A | ⭐⭐⭐⭐⭐ |
| Restaurants | 🔥 Muito Alto | 🔴 Alta | N/A | ⭐⭐⭐⭐ |
| Gyms & Fitness | 🔥 Alto | 🟡 Médio | N/A | ⭐⭐⭐⭐ |
| Salons & Barbers | 🟠 Médio | 🟢 Baixa | N/A | ⭐⭐⭐⭐⭐ |
| Pet Shops | 🟠 Médio | 🟢 Baixa | N/A | ⭐⭐⭐⭐ |
| Hotels | 🔥 Muito Alto | 🔴 Alta | N/A | ⭐⭐⭐ |
| Coworkings | 🟠 Médio | 🟢 Baixa | N/A | ⭐⭐⭐⭐⭐ |
| Coffee Makers (Amazon) | 🔥 Alto | 🟡 Médio | 💰💰💰 | ⭐⭐⭐ |
| Espresso Machines | 🟠 Médio | 🟡 Médio | 💰💰💰💰 | ⭐⭐⭐ |
| Kitchen Gadgets | 🔥 Alto | 🔴 Alta | 💰💰 | ⭐⭐ |

---

## Referência Rápida

### Comandos Mais Usados

```bash
# Build
python build.py configs/<slug>.json

# Preview local
cd output && python -m http.server 8080

# Deploy
npx wrangler pages deploy output --project-name=<nome>

# Processar imagens (script custom)
python scripts/process_images.py <input_folder>

# Validar JSON
python -c "import json; json.load(open('configs/<slug>.json')); print('✅ JSON válido')"
python -c "import json; json.load(open('data/<slug>/listings.json')); print('✅ Listings válido')"
```

### Links Úteis

| Recurso | URL |
|---|---|
| Cloudflare Pages Dashboard | https://dash.cloudflare.com |
| Google Places API | https://developers.google.com/maps/documentation/places |
| Leaflet.js Docs | https://leafletjs.com/reference.html |
| Google Fonts | https://fonts.google.com |
| Schema.org Validator | https://validator.schema.org |
| Google Search Console | https://search.google.com/search-console |
| WebP Converter | https://squoosh.app |
| Wrangler CLI Docs | https://developers.cloudflare.com/workers/wrangler |

---

*Blueprint v2.0 — TechSites A.I. — Documento interno para replicação do Template Master Directory*
