# Las Vegas Music School website

Static multi-page site for [lasvegasmusicschools.com](https://www.lasvegasmusicschools.com). Plain HTML, CSS and JavaScript: no framework and no build step. Every page is a folder with an `index.html`, so URLs are clean (`/piano-lessons-las-vegas/`).

## Structure

```
index.html                  Home
<page>/index.html           One folder per page (see table)
locations/<studio>/         Eight studio pages
blog/<post>/                Blog posts
assets/css/site.css         All styles (colour and type tokens at the top)
assets/js/site.js           All behaviour (menu, carousel, forms, booking)
assets/img/                 Images, named for search (e.g. piano-lessons-las-vegas.jpg)
assets/fonts/               Self-hosted web fonts
sitemap.xml, robots.txt     For search engines
llms.txt                    Plain summary for AI assistants
_redirects, _headers        Cloudflare Pages redirects and headers
404.html                    Not-found page
```

All links are relative, so the site works at a domain root or in a subfolder (for example a GitHub Pages project URL).

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/music-lessons/` | All instruments |
| `/piano-lessons-las-vegas/` | Piano lessons |
| `/guitar-lessons-las-vegas/` | Guitar lessons |
| `/drum-lessons-las-vegas/` | Drum lessons |
| `/saxophone-lessons-las-vegas/` | Saxophone, clarinet & flute |
| `/trumpet-lessons-las-vegas/` | Trumpet & trombone |
| `/violin-lessons-las-vegas/` | Violin, viola & cello |
| `/adult-music-lessons/` | Adult lessons |
| `/private-music-lessons/` | Private lessons |
| `/online-music-lessons/` | Online lessons |
| `/prices/` | Tuition |
| `/apply/` | Apply |
| `/book-now/` | Book an Initial Assessment |
| `/contact/` | Contact |
| `/curriculum-guide/` | Curriculum guide |
| `/gift-cards/` | Gift cards |
| `/faq/` | FAQ |
| `/locations/` | All studios |
| `/about/` | About |
| `/thank-you-guide/` | Thank you (guide) |
| `/thank-you/` | Thank you (contact) |
| `/site-map/` | Site map |
| `/locations/downtown-summerlin/` | Studio: downtown summerlin |
| `/locations/tivoli-village/` | Studio: tivoli village |
| `/locations/park-run/` | Studio: park run |
| `/locations/town-center-drive/` | Studio: town center drive |
| `/locations/meridian-vista/` | Studio: meridian vista |
| `/locations/arroyo-crossing/` | Studio: arroyo crossing |
| `/locations/town-square/` | Studio: town square |
| `/locations/green-valley-ranch/` | Studio: green valley ranch |
| `/blog/` | Blog |
| `/blog/piano-lessons-cost-las-vegas/` | Blog: piano lessons cost las vegas |
| `/blog/what-age-start-piano-lessons/` | Blog: what age start piano lessons |
| `/blog/guitar-lessons-first-three-months/` | Blog: guitar lessons first three months |
| `/blog/violin-lessons-for-kids/` | Blog: violin lessons for kids |
| `/blog/drum-lessons-kids-practice-at-home/` | Blog: drum lessons kids practice at home |
| `/blog/choosing-a-music-school-las-vegas/` | Blog: choosing a music school las vegas |
| `/thank-you-assessment/` | Thank you (assessment request) |

Titles, meta descriptions, canonical URLs, Open Graph tags and structured data (JSON-LD) are written into each page's `<head>`. Thank-you pages are `noindex`.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

**Cloudflare Pages (recommended).** Workers & Pages → Create → Pages → Connect to Git → choose this repository. Framework preset: None. Build command: leave empty. Output directory: `/`. Every push to the chosen branch redeploys. `_redirects` (301s from the old Squarespace URLs) and `_headers` only work on Cloudflare Pages.

**GitHub Pages.** Settings → Pages → Deploy from a branch → select the branch and `/ (root)`. The site works, but GitHub Pages ignores `_redirects` and `_headers`, so old URLs won't redirect.

Don't point the live domain at this site until the launch checklist below is done.

## Forms

Every form (assessment booking, apply, contact, curriculum guide, gift card order, newsletter) posts to `/api/submit`, a Cloudflare Pages Function in `functions/api/submit.js`. It emails the submission to **admin@lasvegasmusicschools.com** through [Resend](https://resend.com), with the family's email as Reply-To so the school can answer with one click. A hidden honeypot field drops most spam.

One-time setup:

1. Create a free Resend account (3,000 emails a month) and add the domain `lasvegasmusicschools.com`. Resend shows a few DNS records (DKIM, SPF and a bounce MX on a `send.` subdomain). Add them where the domain's DNS is managed. They sit alongside the Google Workspace records and don't affect Gmail.
2. In Resend, create an API key with "sending" access.
3. In Cloudflare: Workers & Pages → this project → Settings → Variables and secrets, add:
   - `RESEND_API_KEY` (type Secret): the key from step 2
   - `MAIL_FROM`: `LVMS Website <website@lasvegasmusicschools.com>`
   - `MAIL_TO` (optional): defaults to `admin@lasvegasmusicschools.com`
   - `AUTOREPLY` (optional): `on` to send each family a short "we received your message" email
4. Redeploy, then submit each form once and check the admin inbox (and spam folder the first time).

If a send fails, the form stays on the page and asks the visitor to call (702) 518-1081 or email admin@lasvegasmusicschools.com, so nothing is lost silently.

**GitHub Pages can't run the function.** To host there instead, set `LVMS_ENDPOINT` at the top of `assets/js/site.js` to a form service URL (for example a Formspree form set to deliver to admin@lasvegasmusicschools.com). The service must accept JSON and return `{"ok": true}` or be adapted accordingly.

Gift card orders are requests: the school emails the buyer a payment link (for example a Stripe Payment Link), and the card is sent once paid. Newsletter sign-ups arrive as emails too; move them into a mailing list tool when one is chosen.

## Before launch

- **Forms:** complete the Resend setup above and test each form end to end.
- **Placeholders** in square brackets are still visible: studio parking and entrance details, instruments per studio, Google review count, the school's story, payment and make-up policies, voice lessons.
- **Hours** differ between sources (site: Mon–Fri 7am–10pm, Sat–Sun 9am–8pm). Confirm with the school and match the Google Business Profiles.
- **Photos.** Instrument and lesson photos are AI-generated placeholders; replace with real studio photos. Home-page portrait credits are listed on the About page; several licenses and photographers still need confirming. Living and recently deceased artists' likenesses need permission (see the hero photo sources page).
- **Quotes** in the home carousel without a source line still need verifying.
- **Redirects.** Add every old URL that Search Console shows with traffic or backlinks to `_redirects`.
- **Analytics.** Add the Google Tag Manager container. The booking form pushes a `generate_lead` event to `dataLayer`.
- **Curriculum guide PDF** doesn't exist yet. Requests arrive by email; send the guide manually until the PDF is written and linked from the thank-you page.

## Editing

Edit page content directly in each `index.html`. Shared header, footer and the scheduling widget are repeated on each page, so a change there needs to be made on every page (search and replace across the repo). Styles and scripts are shared in `assets/`.
