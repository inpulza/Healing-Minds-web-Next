# SEO Publishing Sprint 1

## Scope

Sprint 1 ports only the reusable SEO publishing layer from the XL Homes pilot into Healing Minds. It does not add a blog, CMS, admin panel, article generation, or healthcare content workflow.

The goal is to prove that the same publishing infrastructure can audit existing public pages, submit the sitemap to Search Console, and inspect URLs with Google before the blog system exists.

## Configuration

Production defaults:

```env
SITE_BASE_URL=https://www.healingmindsp.com
SEO_SITEMAP_URL=https://www.healingmindsp.com/sitemap.xml
GSC_SITE_URL=sc-domain:healingmindsp.com
```

Optional audit threshold:

```env
SEO_MIN_RENDERED_WORDS=75
```

Search Console integration uses the same environment variable names as XL Homes:

```env
GSC_OAUTH_CLIENT_ID=
GSC_OAUTH_CLIENT_SECRET=
GSC_OAUTH_REFRESH_TOKEN=
```

Do not generate a new refresh token for this repo. Use the secure Inpulza Google infrastructure and Replit Secrets only. Never commit credential files or paste secret values into source files.

## Internal Test Script

Run the default route audit:

```bash
npm run seo:check
```

Run without Google API calls:

```bash
npm run seo:check -- --no-google
```

Run one route:

```bash
npm run seo:check -- /services/anxiety-treatment
```

When checking multiple routes with Google enabled, the script submits the sitemap once per execution and still runs URL Inspection for each route.

Default routes checked:

- `/`
- `/services/anxiety-treatment`
- `/locations/psychiatrist-naples`
- `/es/servicios/tratamiento-ansiedad`

## Expected Result Without Credentials

```json
{
  "renderAudit": { "ok": true },
  "searchConsole": {
    "configured": false,
    "sitemapSubmitted": false,
    "error": "Search Console OAuth env vars are not configured"
  }
}
```

## Expected Result With Credentials

```json
{
  "renderAudit": { "ok": true },
  "searchConsole": {
    "configured": true,
    "sitemapSubmitted": true
  }
}
```

URL Inspection may still report `Discovered - currently not indexed` or `URL is unknown to Google` for fresh URLs. The key Sprint 1 validation is that the page audit passes, the sitemap submit succeeds, and Search Console returns a structured inspection response or a clear API error.

## Explicitly Out Of Scope

- `/blog`
- `/blog/:slug`
- blog database tables
- blog admin
- article generation
- image generation
- changing the existing `/blog/...` 410 rule
- healthcare/YMYL content prompts

Those belong to later sprints.
