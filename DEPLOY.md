# Deploy to Vercel

1. Push the repo to GitHub, GitLab or Bitbucket.
2. In Vercel: **Add New... -> Project**, import the repo.
3. Framework preset: **Next.js** (auto-detected). Leave the defaults:
   - Build command: `next build`
   - Output directory: default (`.next`; do not set `out`)
   - Install command: default
   - Root directory: the repo root
4. Environment Variables (Project Settings -> Environment Variables). All are optional; see `.env.example`.

   | Name | Value | Effect |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain` | Canonical URL for metadata, Open Graph, sitemap, robots. Default `http://localhost:3000`. |
   | `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | your form endpoint | Contact form POST target. Unset: the form is disabled and shows the email address. |
   | `NEXT_PUBLIC_ALLOW_INDEXING` | `true` or unset | Unset (default): `noindex, nofollow` and `robots.txt` disallows all. Set `true` only at launch. |

   `NEXT_PUBLIC_*` values are inlined at build time. Redeploy after changing them.
5. Deploy. Every push to the production branch redeploys; other branches get preview URLs (previews stay noindex while the flag is unset).

## Attach a domain later

1. Project -> Settings -> Domains -> Add, enter the domain.
2. Add the DNS record Vercel shows (A record for the apex, CNAME for `www`), at your registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` URL and redeploy.
4. When the brand name and email are final (`config/brand.ts`), set `NEXT_PUBLIC_ALLOW_INDEXING=true` and redeploy.

## Check locally

```
npm install
npm run build
npm run start
```
