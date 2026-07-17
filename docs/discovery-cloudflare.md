# Cloudflare robots.txt and discovery

Persidian serves `robots.txt` from Next.js (`app/robots.ts`) at the origin. Production is fronted by Cloudflare, which may inject a **Managed robots.txt** block (Content Signals) ahead of the origin file.

## Symptom

Live `https://persidian.com/robots.txt` may:

- Omit `Sitemap: https://persidian.com/sitemap.xml`
- Omit explicit rules for `OAI-SearchBot` and `Claude-SearchBot`
- Include Cloudflare `Content-Signal` headers instead of origin rules only

Run `./scripts/verify-discovery.sh` to check production.

## Fix (Cloudflare dashboard)

1. Open the **persidian.com** zone in Cloudflare.
2. Go to **Security** → **Bots** (or **AI Crawl Control** / **Content Signals**, depending on plan UI).
3. **Disable** “Managed robots.txt” / “Content Signals in robots.txt” so the origin response from Next.js is served unchanged.
4. Purge cache for `/robots.txt` if needed.
5. Re-run `./scripts/verify-discovery.sh`.

Expected origin rules (from `app/robots.ts`):

- `OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`: allow `/`
- `GPTBot`, `ClaudeBot`: disallow `/`
- `*`: allow `/`
- `Sitemap: https://persidian.com/sitemap.xml`

## Search engine sitemaps (operational)

After robots is fixed, submit the sitemap manually:

- [Google Search Console](https://search.google.com/search-console) → Sitemaps → `https://persidian.com/sitemap.xml`
- [Bing Webmaster Tools](https://www.bing.com/webmasters) → Sitemaps → same URL

These steps cannot be automated from the repo; they require site-owner access to each console.
