# Template Master Directory

**TechSites A.I.** — Static multi-page directory generator for local business listings.

## Pilot: Dubai Coffee Guide
- Domain: dubai.fond.coffee
- Fallback: dubai-coffee-dir.pages.dev

## Build

```bash
python build.py configs/dubai-coffee.json
```

## Deploy

```bash
CLOUDFLARE_API_TOKEN="your-token" \
CLOUDFLARE_ACCOUNT_ID="your-account-id" \
npx wrangler pages deploy output/ --project-name=dubai-coffee-dir --commit-dirty=true --branch=main
```

## Structure

```
├── build.py                  ← Main builder
├── configs/                  ← Directory configs
├── data/                     ← Listings data per directory
├── templates/                ← HTML templates (5)
├── assets/css/style.css      ← Complete CSS
├── assets/js/directory.js    ← Vanilla JS
├── output/                   ← Generated site (deploy from here)
└── docs/                     ← Build reports
```

## Rules
- NO WYSIWYG editor (no techsites-editor.js, no data-editable)
- Mobile-first responsive (375px+)
- Vanilla JS only (no frameworks)
- Always validate visually before deploy
