#!/usr/bin/env python3
"""
Template Master Directory — Static Site Builder
TechSites A.I. — Generates multi-page static directories from templates + config + data.

Usage:
    python build.py configs/dubai-coffee.json
"""

import json
import os
import re
import shutil
import sys
from pathlib import Path
from datetime import datetime


# ──────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
ASSETS_DIR = BASE_DIR / "assets"
OUTPUT_DIR = BASE_DIR / "output"


def load_json(path):
    """Load and parse a JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_file(path, content):
    """Write content to a file, creating directories as needed."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


# ──────────────────────────────────────────────
# Listing helpers
# ──────────────────────────────────────────────
def get_category_name(categories, cat_id):
    """Get category display name from ID."""
    for cat in categories:
        if cat["id"] == cat_id:
            return cat["name"]
    return cat_id.replace("-", " ").title()


def get_area_name(areas, area_id):
    """Get area display name from ID."""
    for area in areas:
        if area["id"] == area_id:
            return area["name"]
    return area_id.replace("-", " ").title()


def get_category_icon(categories, cat_id):
    """Get Lucide icon name for a category."""
    for cat in categories:
        if cat["id"] == cat_id:
            return cat.get("icon", "map-pin")
    return "map-pin"


def compute_stats(config, listings):
    """Compute dynamic stats from listings data."""
    total = len(listings)
    categories_used = set(l["category"] for l in listings)
    areas_used = set(l["area"] for l in listings)
    ratings = [l["google_rating"] for l in listings if l.get("google_rating")]
    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0

    return {
        "STAT_TOTAL": str(total),
        "STAT_CATEGORIES": str(len(categories_used)),
        "STAT_AREAS": str(len(areas_used)),
        "STAT_RATING": str(avg_rating),
    }


def generate_star_rating(rating):
    """Generate HTML star rating from a float."""
    full = int(rating)
    half = 1 if rating - full >= 0.3 else 0
    empty = 5 - full - half
    html = '<span class="stars">'
    html += '<span class="star full">&#9733;</span>' * full
    if half:
        html += '<span class="star half">&#9733;</span>'
    html += '<span class="star empty">&#9733;</span>' * empty
    html += '</span>'
    return html


def generate_hours_html(hours):
    """Generate HTML table for opening hours."""
    if isinstance(hours, str):
        return f'<p class="listing-hours-simple">{hours}</p>'
    if not isinstance(hours, dict):
        return ""
    days_order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    day_labels = {
        "monday": "Mon", "tuesday": "Tue", "wednesday": "Wed",
        "thursday": "Thu", "friday": "Fri", "saturday": "Sat", "sunday": "Sun"
    }
    rows = ""
    for day in days_order:
        time_str = hours.get(day, "—")
        is_closed = time_str.lower() == "closed"
        cls = ' class="closed"' if is_closed else ''
        rows += f'<tr{cls}><td>{day_labels[day]}</td><td>{time_str}</td></tr>\n'
    return f'<table class="hours-table">\n<tbody>\n{rows}</tbody>\n</table>'


# ──────────────────────────────────────────────
# Card generators
# ──────────────────────────────────────────────
def generate_listing_card(listing, config):
    """Generate a single listing card HTML."""
    categories = config.get("CATEGORIES", [])
    areas = config.get("AREAS", [])
    cat_name = get_category_name(categories, listing["category"])
    area_name = get_area_name(areas, listing["area"])
    rating = listing.get("google_rating", 0)
    reviews = listing.get("google_reviews", 0)
    stars = generate_star_rating(rating)
    photo = listing.get("photo_url", "assets/images/placeholder.webp")
    tags_html = ""
    if listing.get("tags"):
        tags_html = '<div class="card-tags">' + "".join(
            f'<span class="tag">{t}</span>' for t in listing["tags"][:3]
        ) + '</div>'

    badge_html = ""
    if listing.get("site_built"):
        badge_html = f'<span class="badge badge-site">{config.get("BADGE_SITE_LIVE", "Site Available")}</span>'

    return f'''<article class="listing-card" data-category="{listing['category']}" data-area="{listing['area']}">
  <a href="listing/{listing['id']}.html" class="card-link">
    <div class="card-image">
      <img src="{photo}" alt="{listing['name']}" loading="lazy" width="400" height="300">
      <span class="card-category-badge">{cat_name}</span>
      {badge_html}
    </div>
    <div class="card-body">
      <h3 class="card-title">{listing['name']}</h3>
      <div class="card-rating">
        {stars}
        <span class="rating-number">{rating}</span>
        <span class="review-count">({reviews} reviews)</span>
      </div>
      <p class="card-address"><i data-lucide="map-pin"></i> {listing.get('address', area_name)}</p>
      {tags_html}
    </div>
  </a>
</article>'''


def generate_category_card(cat, count):
    """Generate a category card HTML."""
    icon = cat.get("icon", "coffee")
    return f'''<a href="category/{cat['id']}.html" class="category-card">
  <div class="category-icon"><i data-lucide="{icon}"></i></div>
  <h3 class="category-name">{cat['name']}</h3>
  <span class="category-count">{count} listings</span>
</a>'''


# ──────────────────────────────────────────────
# Template processing
# ──────────────────────────────────────────────
def replace_placeholders(template, config, extra=None):
    """Replace {{PLACEHOLDER}} tokens in template with config values."""
    result = template
    replacements = {}

    # Flatten config (skip complex types)
    for key, val in config.items():
        if isinstance(val, (str, int, float, bool)):
            replacements[key] = str(val)

    if extra:
        replacements.update(extra)

    for key, val in replacements.items():
        result = result.replace("{{" + key + "}}", val)

    return result


def check_unfilled_placeholders(html, page_name):
    """Warn about any remaining {{...}} placeholders."""
    remaining = re.findall(r'\{\{([A-Z_]+)\}\}', html)
    if remaining:
        unique = sorted(set(remaining))
        print(f"  ⚠  {page_name}: {len(unique)} unfilled placeholder(s): {', '.join(unique[:10])}")
    return remaining


# ──────────────────────────────────────────────
# Page builders
# ──────────────────────────────────────────────
def build_home(config, listings, templates):
    """Build index.html (home page)."""
    template = templates["home"]
    categories = config.get("CATEGORIES", [])
    areas = config.get("AREAS", [])

    # Count listings per category
    cat_counts = {}
    for l in listings:
        cat_counts[l["category"]] = cat_counts.get(l["category"], 0) + 1

    # Generate category cards
    cat_cards = "\n".join(
        generate_category_card(cat, cat_counts.get(cat["id"], 0))
        for cat in categories
    )

    # Generate listing cards (all)
    listing_cards = "\n".join(
        generate_listing_card(l, config) for l in listings
    )

    # Featured listings (top by rating, max 6)
    featured = sorted(listings, key=lambda x: x.get("google_rating", 0), reverse=True)[:6]
    featured_cards = "\n".join(
        generate_listing_card(l, config) for l in featured
    )

    # Compute stats
    stats = compute_stats(config, listings)

    # Listings JSON for search/filter
    listings_json = json.dumps(
        [{
            "id": l["id"], "name": l["name"], "category": l["category"],
            "area": l["area"], "rating": l.get("google_rating", 0),
            "reviews": l.get("google_reviews", 0),
            "address": l.get("address", ""),
            "tags": l.get("tags", [])
        } for l in listings],
        ensure_ascii=False
    )

    # Raw JSON for JS config
    categories_json = json.dumps(config.get("CATEGORIES", []), ensure_ascii=False)
    areas_json = json.dumps(config.get("AREAS", []), ensure_ascii=False)

    extra = {
        **stats,
        "CATEGORY_CARDS": cat_cards,
        "LISTING_CARDS": listing_cards,
        "FEATURED_CARDS": featured_cards,
        "LISTINGS_JSON": listings_json,
        "CATEGORIES_JSON_RAW": categories_json,
        "AREAS_JSON_RAW": areas_json,
        "LISTINGS_COUNT": str(len(listings)),
    }

    html = replace_placeholders(template, config, extra)
    check_unfilled_placeholders(html, "index.html")
    write_file(OUTPUT_DIR / "index.html", html)
    print("  ✓ index.html")


def build_listing_pages(config, listings, templates):
    """Build individual listing pages."""
    template = templates["listing"]
    categories = config.get("CATEGORIES", [])
    areas = config.get("AREAS", [])

    for listing in listings:
        cat_name = get_category_name(categories, listing["category"])
        area_name = get_area_name(areas, listing["area"])
        rating = listing.get("google_rating", 0)
        reviews = listing.get("google_reviews", 0)
        stars = generate_star_rating(rating)
        photo = listing.get("photo_url", "assets/images/placeholder.webp")
        hours_html = generate_hours_html(listing.get("hours", {}))

        tags_html = ""
        if listing.get("tags"):
            tags_html = "".join(f'<span class="tag">{t}</span>' for t in listing["tags"])

        # Related listings (same category, max 3, exclude current)
        related = [l for l in listings if l["category"] == listing["category"] and l["id"] != listing["id"]][:3]
        related_cards = "\n".join(generate_listing_card(r, config) for r in related)

        # Phone / directions links
        phone_link = listing.get("phone", "").replace(" ", "").replace("-", "")
        directions_url = f"https://www.google.com/maps/dir/?api=1&destination={listing.get('lat', '')},{listing.get('lng', '')}"
        website_url = listing.get("website", "") or listing.get("site_url", "")

        extra = {
            "LISTING_NAME": listing["name"],
            "LISTING_ID": listing["id"],
            "LISTING_CATEGORY": cat_name,
            "LISTING_CATEGORY_ID": listing["category"],
            "LISTING_AREA": area_name,
            "LISTING_AREA_ID": listing["area"],
            "LISTING_ADDRESS": listing.get("address", area_name),
            "LISTING_PHONE": listing.get("phone", ""),
            "LISTING_PHONE_LINK": phone_link,
            "LISTING_WEBSITE": website_url,
            "LISTING_RATING": str(rating),
            "LISTING_REVIEWS": str(reviews),
            "LISTING_STARS": stars,
            "LISTING_PHOTO": photo,
            "LISTING_DESCRIPTION": listing.get("description", ""),
            "LISTING_HOURS": hours_html,
            "LISTING_TAGS": tags_html,
            "LISTING_LAT": str(listing.get("lat", "")),
            "LISTING_LNG": str(listing.get("lng", "")),
            "LISTING_DIRECTIONS_URL": directions_url,
            "RELATED_CARDS": related_cards,
            "BREADCRUMB_CATEGORY": cat_name,
            "BREADCRUMB_CATEGORY_URL": f"../category/{listing['category']}.html",
        }

        html = replace_placeholders(template, config, extra)
        check_unfilled_placeholders(html, f"listing/{listing['id']}.html")
        write_file(OUTPUT_DIR / "listing" / f"{listing['id']}.html", html)

    print(f"  ✓ {len(listings)} listing pages")


def build_category_pages(config, listings, templates):
    """Build category pages."""
    template = templates["category"]
    categories = config.get("CATEGORIES", [])

    for cat in categories:
        cat_listings = [l for l in listings if l["category"] == cat["id"]]
        listing_cards = "\n".join(generate_listing_card(l, config) for l in cat_listings)

        extra = {
            "CATEGORY_NAME": cat["name"],
            "CATEGORY_ID": cat["id"],
            "CATEGORY_ICON": cat.get("icon", "coffee"),
            "CATEGORY_COUNT": str(len(cat_listings)),
            "CATEGORY_DESCRIPTION": f"Browse all {cat['name'].lower()} listings in {config.get('DIRECTORY_CITY', 'the city')}.",
            "CATEGORY_LISTING_CARDS": listing_cards,
        }

        html = replace_placeholders(template, config, extra)
        check_unfilled_placeholders(html, f"category/{cat['id']}.html")
        write_file(OUTPUT_DIR / "category" / f"{cat['id']}.html", html)

    print(f"  ✓ {len(categories)} category pages")


def build_blog(config, templates):
    """Build blog page."""
    template = templates["blog"]
    html = replace_placeholders(template, config)
    check_unfilled_placeholders(html, "blog.html")
    write_file(OUTPUT_DIR / "blog.html", html)
    print("  ✓ blog.html")


def build_static_pages(config, templates):
    """Build about, contact, and 404 pages."""
    template = templates["page"]

    pages = [
        {
            "filename": "about.html",
            "PAGE_TITLE": config.get("ABOUT_TITLE", "About"),
            "PAGE_CONTENT": f'''<p>{config.get("ABOUT_DESC", "")}</p>
<p>{config.get("DIRECTORY_DESCRIPTION", "")}</p>''',
            "PAGE_ID": "about",
        },
        {
            "filename": "contact.html",
            "PAGE_TITLE": config.get("CONTACT_TITLE", "Contact Us"),
            "PAGE_CONTENT": f'''<div class="contact-info">
  <div class="contact-item"><i data-lucide="mail"></i><a href="mailto:{config.get("CONTACT_EMAIL", "")}">{config.get("CONTACT_EMAIL", "")}</a></div>
  <div class="contact-item"><i data-lucide="phone"></i><a href="tel:{config.get("CONTACT_PHONE", "")}">{config.get("CONTACT_PHONE", "")}</a></div>
  <div class="contact-item"><i data-lucide="message-circle"></i><a href="{config.get("CONTACT_WHATSAPP", "")}" target="_blank">WhatsApp</a></div>
  <div class="contact-item"><i data-lucide="map-pin"></i><span>{config.get("CONTACT_ADDRESS", "")}</span></div>
</div>''',
            "PAGE_ID": "contact",
        },
        {
            "filename": "404.html",
            "PAGE_TITLE": "Page Not Found",
            "PAGE_CONTENT": f'''<div class="error-page">
  <h2>404</h2>
  <p>The page you're looking for doesn't exist.</p>
  <a href="/" class="btn btn-primary">Back to Home</a>
</div>''',
            "PAGE_ID": "404",
        },
    ]

    for page in pages:
        extra = {
            "PAGE_TITLE": page["PAGE_TITLE"],
            "PAGE_CONTENT": page["PAGE_CONTENT"],
            "PAGE_ID": page["PAGE_ID"],
        }
        html = replace_placeholders(template, config, extra)
        check_unfilled_placeholders(html, page["filename"])
        write_file(OUTPUT_DIR / page["filename"], html)

    print("  ✓ about.html, contact.html, 404.html")


# ──────────────────────────────────────────────
# SEO generators
# ──────────────────────────────────────────────
def build_sitemap(config, listings):
    """Generate sitemap.xml."""
    domain = config.get("CANONICAL_URL", f"https://{config.get('DIRECTORY_DOMAIN', '')}/")
    if not domain.endswith("/"):
        domain += "/"

    now = datetime.utcnow().strftime("%Y-%m-%d")
    urls = [
        f'  <url><loc>{domain}</loc><lastmod>{now}</lastmod><priority>1.0</priority></url>',
        f'  <url><loc>{domain}about.html</loc><lastmod>{now}</lastmod><priority>0.5</priority></url>',
        f'  <url><loc>{domain}contact.html</loc><lastmod>{now}</lastmod><priority>0.5</priority></url>',
        f'  <url><loc>{domain}blog.html</loc><lastmod>{now}</lastmod><priority>0.6</priority></url>',
    ]

    for cat in config.get("CATEGORIES", []):
        urls.append(f'  <url><loc>{domain}category/{cat["id"]}.html</loc><lastmod>{now}</lastmod><priority>0.7</priority></url>')

    for l in listings:
        urls.append(f'  <url><loc>{domain}listing/{l["id"]}.html</loc><lastmod>{now}</lastmod><priority>0.8</priority></url>')

    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>'''

    write_file(OUTPUT_DIR / "sitemap.xml", sitemap)
    print(f"  ✓ sitemap.xml ({len(urls)} URLs)")


def build_robots(config):
    """Generate robots.txt."""
    domain = config.get("CANONICAL_URL", f"https://{config.get('DIRECTORY_DOMAIN', '')}/")
    robots = f"""User-agent: *
Allow: /

Sitemap: {domain}sitemap.xml
"""
    write_file(OUTPUT_DIR / "robots.txt", robots)
    print("  ✓ robots.txt")


# ──────────────────────────────────────────────
# Asset copy
# ──────────────────────────────────────────────
def copy_assets():
    """Copy assets directory to output."""
    src = ASSETS_DIR
    dst = OUTPUT_DIR / "assets"
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)
    print("  ✓ assets/ copied")


# ──────────────────────────────────────────────
# Main build
# ──────────────────────────────────────────────
def main():
    if len(sys.argv) < 2:
        print("Usage: python build.py configs/dubai-coffee.json")
        sys.exit(1)

    config_path = Path(sys.argv[1])
    if not config_path.is_absolute():
        config_path = BASE_DIR / config_path

    print(f"\n{'='*60}")
    print(f"  Template Master Directory — Builder")
    print(f"  Config: {config_path.name}")
    print(f"{'='*60}\n")

    # Load config
    print("📦 Loading config...")
    config = load_json(config_path)
    slug = config.get("DIRECTORY_SLUG", "directory")
    print(f"  Directory: {config.get('DIRECTORY_NAME', slug)}")

    # Load listings
    data_path = BASE_DIR / "data" / slug / "listings.json"
    print(f"📋 Loading listings from {data_path.name}...")
    data = load_json(data_path)
    listings = data.get("listings", [])
    print(f"  Found {len(listings)} listings")

    # Update category counts
    cat_counts = {}
    for l in listings:
        cat_counts[l["category"]] = cat_counts.get(l["category"], 0) + 1
    for cat in config.get("CATEGORIES", []):
        cat["count"] = cat_counts.get(cat["id"], 0)

    # Load templates
    print("📄 Loading templates...")
    templates = {}
    template_map = {
        "home": "index-directory.html",
        "listing": "listing-template.html",
        "category": "category-template.html",
        "blog": "blog-template.html",
        "page": "page-template.html",
    }
    for key, filename in template_map.items():
        tpath = TEMPLATES_DIR / filename
        if tpath.exists():
            with open(tpath, "r", encoding="utf-8") as f:
                templates[key] = f.read()
            print(f"  ✓ {filename}")
        else:
            print(f"  ✗ {filename} NOT FOUND — skipping")

    # Clean output
    print("\n🧹 Cleaning output/...")
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    # Build pages
    print("\n🔨 Building pages...")
    if "home" in templates:
        build_home(config, listings, templates)
    if "listing" in templates:
        build_listing_pages(config, listings, templates)
    if "category" in templates:
        build_category_pages(config, listings, templates)
    if "blog" in templates:
        build_blog(config, templates)
    if "page" in templates:
        build_static_pages(config, templates)

    # SEO files
    print("\n🔍 Generating SEO files...")
    build_sitemap(config, listings)
    build_robots(config)

    # Copy assets
    print("\n📁 Copying assets...")
    copy_assets()

    # Summary
    html_count = len(list(OUTPUT_DIR.rglob("*.html")))
    print(f"\n{'='*60}")
    print(f"  ✅ BUILD COMPLETE")
    print(f"  HTMLs generated: {html_count}")
    print(f"  Output: {OUTPUT_DIR}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
