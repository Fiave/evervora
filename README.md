# Evervora Market GH

A mobile-first product catalogue and single-owner admin area. Built with Next.js App Router, TypeScript, Tailwind CSS and shadcn/ui; Neon Postgres/managed auth; ImageKit uploads and delivery; Netlify hosting.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Without `DATABASE_URL`, the storefront and `/admin` display clearly labelled, read-only sample products. No changes are saved in demo mode. The stock photos are illustrative, not the business’s real inventory. WhatsApp contact buttons use the configured business number and open a draft message; nothing is sent automatically. Database connection failures do not silently fall back to sample stock.

## Connect the real shop

1. Create a Neon project in an AWS region supported by managed auth. Copy its pooled Postgres connection string. Enable managed authentication for that branch, configure email/password and password-recovery email, and add the local and production origins as trusted domains.
2. Copy `.env.example` to `.env.local`. Set `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and a `NEON_AUTH_COOKIE_SECRET` of at least 32 random characters (generate with `openssl rand -base64 32`). Keep all private keys out of Git.
3. Create the owner account through Neon’s user management or its auth provisioning API. Put the owner’s user ID into `ADMIN_USER_ID`. There is no signup UI, the app auth proxy blocks signup, and every write checks this exact ID. Do not use an email address in place of the ID. Lock down provider signup after provisioning if supported in your auth settings.
4. Create an ImageKit account. Set `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, and `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` (without a trailing slash). The private key stays server-side. Upload authentication is short-lived and only issued to the approved owner. Images are delivered directly by ImageKit via a custom Next.js image loader; they do not go through the hosting provider’s image transformation service.
5. Set `DATABASE_URL_UNPOOLED` to the direct connection for migrations. Generate/apply the schema, then seed the four categories and initial shop settings:

```sh
node --env-file=.env.local node_modules/drizzle-kit/bin.cjs migrate
npm run db:seed
```

The initial migration is committed in `drizzle/`. For future schema edits use `npm run db:generate`, review the SQL, then migrate. Seeding never inserts demo products. Use a development database/branch for local experimentation.

6. Start the app, visit `/admin/login`, and sign in as the owner. Add real product photos and descriptions, then turn on “Publish in shop”. Enter the real WhatsApp Business number (including country code), delivery info and social links under Shop settings. The default WhatsApp number is +233 20 898 7183; update it here if it changes.

## Deploy to Netlify

Import this repository into the business-owned Netlify account. `netlify.toml` sets `npm run build`, `.next`, and Node 22. Netlify supplies its maintained Next.js runtime automatically. This is a server-rendered app, not a static export.

Add the same environment variables through Netlify’s environment settings. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS production address (no trailing slash). Values beginning `NEXT_PUBLIC_` are public and baked into the build, so redeploy after changing them. Update Neon trusted origins/password reset redirect configuration to the production domain.

Run migrations against the production database before deploying a schema change; do not run migrations automatically in every preview build. Use an isolated Neon branch and a separate approved test account for deployment previews. Configure Netlify usage alerts and monitor ImageKit/Neon quotas. Product changes write to the database and do not trigger a production redeploy.

Before sharing the link, confirm owner login/recovery, publishing, photo upload/reordering, customer search, WhatsApp number and message, sold-out behavior, and mobile layout. A custom domain can be connected later; update the site origin and trusted auth URLs when it changes.

## Checks

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Browser tests use an unconfigured read-only demo. Install the browser once with `npx playwright install chromium`. Real Neon/auth/ImageKit integrations require configured accounts and must also be tested before launch; local demo checks do not prove those external services work.

## Product behavior

- Visitors browse without accounts. Category filtering and search are shareable via URL. Catalogue pages contain up to 12 products.
- Public prices, checkout, payments, order management, quantities and selectable variants are intentionally absent. Options go in descriptions; purchases happen in WhatsApp.
- One to five JPG/PNG/WebP images per product, maximum 10 MB each. Camera capture depends on the phone browser; HEIC photos must be exported as JPG.
- The first image is the cover. Upload errors preserve entered form data and allow retries. Newly uploaded files abandoned before saving may remain in ImageKit; periodically remove unreferenced files from its media library.
- Product saves replace ordered image references atomically. Removed/deleted saved images are cleaned up on a best-effort basis after the database succeeds. Category foreign keys prevent deleting categories with attached products.
- Hiding a product removes its public details page; sold-out published products offer restock enquiries. Product slugs remain stable when the name changes.

## Design and image references

The orange/black identity and business wording come from the supplied flyer (`public/brand-flyer.jpg`). Product-card layouts were informed by 21st.dev’s ecommerce examples (https://21st.dev/community/components/explore/ecommerce-components), composed with shadcn primitives rather than copying third-party component code.

Local preview product photos are from Unsplash: photo-1505740420928-5e560c06d30e, photo-1542291026-7eec264c27ff, photo-1523275335684-37898b6baf30, photo-1553062407-98eeb64c6a62, photo-1608043152269-423dbba4e7e1, photo-1511499767150-a48a237f0083, photo-1511707171634-5f897ff02aa9, photo-1602143407151-7111542de6e8. Replace these examples by creating real products through the admin area; they are not seeded into the real database.

### WhatsApp contact behaviour

Product photos and names open the details page. The WhatsApp logo + Contact button opens a product-specific `wa.me` draft directly; sold-out products ask about restocking. On the details page, starter questions are optional, and customers can edit or replace the draft inside WhatsApp before tapping Send. Nothing is sent automatically.

Clickable reply options **inside WhatsApp** require a separate WhatsApp Business Platform / Cloud API integration and a business-sent interactive message. The current website does not implement that integration. See [Meta’s reply-button API](https://www.postman.com/meta/whatsapp-business-platform/request/ne00kt6/send-reply-button).

### Temporary sample catalogue

`SHOW_SAMPLE_PRODUCTS=true` displays the eight sample products only while the real products table is empty. They are presentation data and are never inserted into Neon. The first real product saved (including a draft) hides every sample; published products then appear normally. Set the flag to `false` to turn off samples at any time.

The connected admin area always manages real inventory and shows actual counts. A separate labelled preview panel displays sample cards while the catalogue preview is active. Samples cannot be edited or deleted through the inventory controls. The public preview is labelled as sample inventory and indexing is off while sample products are shown. WhatsApp enquiry links remain available.
