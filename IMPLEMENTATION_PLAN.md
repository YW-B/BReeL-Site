# BReeL Website — Implementation Plan

## Positioning the site has to communicate

BReeL is a **shadow operator / growth partner**. Creators with 20k–500k followers who are *content-rich, offer-poor* keep being the face of the brand. BReeL builds and runs everything behind it: offer architecture, Whop storefront, Notion OS hub, ManyChat DM funnels and the 14-day launch. Net profit is split 50/50 (or a custom rev-share), and the creator pays nothing upfront.

Every section has to answer one of three visitor questions:

| Visitor | Question | Where it gets answered |
|---|---|---|
| Creator (ICP) | "Do you fit me, and what do I get?" | Hero, 4-Tier Stack, Qualification, Apply (Calendly) |
| Buyer / DIY creator | "What can I buy today?" | Products (Low → Payhip `Dt4ab`, Mid → Payhip `HskxF`, High → Calendly) |
| Aspiring operator / affiliate | "How do I learn this or earn with you?" | Growth Operator education, Affiliate Army (Whop) |

## Stack decision

The supplied website prompt specifies **static HTML + CSS + vanilla JS**, so Phase 1 follows it instead of the Next.js setup in the original phase diagram. That covers a single viewport plus a few sections without trouble. Move to Next.js (App Router) + Tailwind only if the site needs several routes, a CMS for case studies, or a blog for the Media Layer. The `siteConfig` object and `data-link` pattern carry over to that migration as they are.

```
index.html      markup (header, hero, stats, mobile menu)
styles.css      tokens + layout + animations
main.js         siteConfig (all external links + UTM) · mobile menu · stat count-up
assets/         logo.webp (orb mark cropped from the Breel8 logo), wordmark.webp, og.jpg, favicon.png
fonts/          GeistPixel-Circle.woff2 (display fallback)
```

## Phases

### Phase 1 — Config & architecture ✅ done
- Static file structure as specified in the prompt.
- `siteConfig` at the top of `main.js` is the single source for every external link. Elements opt in with `data-link="<key>"` and `data-utm="<placement>"`, and `utm_source=breel-site&utm_medium=<placement>&utm_campaign=landing` is appended automatically.
- Hardcoded `href`s stay in the HTML, so links still work without JS.

### Phase 2 — Design system & hero viewport ✅ done
Built to the prompt spec: CloudFront background video, Inter, the BubbledotICG-FinePos dot-matrix display font, white nav pill with three-dot active state, dark pill, staggered reveal and slideDown entrances, and the mobile burger with sheet menu. The prompt's generic copy was replaced with BReeL copy:

| Spec slot | BReeL version |
|---|---|
| Headline | **You Stay The Face. / We Run The Engine.** (the shadow operator model in 2 lines) |
| Subhead | Build + run backend → 50/50 net profit → zero risk |
| Trust row | Instagram / TikTok / YouTube rings + "For creators with 20k–500k followers" |
| CTA | **Apply to Partner** → Calendly |
| Nav pill | Home · Products · Agency · Contact (in-page anchors + scroll-spy) |
| Dark pill | **Shop** → `#products` |
| Stats | 50/50 Net Profit Split · $0 Upfront Cost · 14-Day Launch Sequence · 4-Tier Revenue Stack |

> The template's "Trusted by 2000+ Enterprises" with Microsoft/Amazon/Google logos was removed on purpose. Showing big-tech logos BReeL hasn't worked with is a false endorsement claim. Swap in real proof (creator count, revenue generated) once it exists.

### Phase 3 — Product & service showcase ✅ done (content pulled from the BReeL Miro board)
The hero still fills the first screen, and the page now scrolls into these sections. The header stays fixed and its active dot follows the section in view.
1. **Shadow Operator Model** (`#agency`): "Your Shop Is Display-Only" (board: Storefront Window Metaphor), plus Division of Labor (Operator vs Creator).
2. **Execution Roadmap** (`#launch`): the 14-day launch in 3 phases (Days 1–3, 4–9, 10–14).
3. **4-Tier Revenue Stack** (`#stack`) plus "What we build inside your Whop" chips (board: Build / Launch / Run slide).
4. **Clients & Work** (`#work`): @3zizpp × Bygone (VIP Bygone Whop: storefront and course screenshots) and the Toni Filmmaking Community. Images are cropped from the Miro board into `assets/work/`.
5. **Guarantee** (`#guarantee`): 30 members in 90 days or BReeL keeps operating free. $0 upfront, 50/50, setup fee waived for 3 founding partners.
6. **Products** (`#products`) with filter tabs All | Products | Software | Agency:
   - Creator Monetization OS, $27 → Payhip `Dt4ab`
   - First Profitable Launch OS, $47 → Payhip `HskxF`
   - 1:1 Monetization Campaign, from $197 → Calendly
   - Keep by BReeL (Whop retention app), **Coming soon**
   - Shadow Operating (50/50) and Platform Earnings Setup → Calendly
   - Buy buttons only link out to Payhip. The site never takes payment itself.
7. **Qualification** (`#qualify`): the ICP checklist.
8. **Become an Operator** (`#operators`): Growth Operator education + Affiliate Army (40%+).
9. **Contact footer** (`#contact`): Instagram for @breel_ar, @darealyehi, @__abnz.
10. **BReeL Games** card sits in Done-For-You Client Work (monthly contests, up to $5K sponsored by BReeL). The guarantee shows the **$7,500 setup fee waived** for the first 3 partners.

### Affiliate page ✅ done (`affiliate.html`, served at `/affiliate` on Vercel via `vercel.json` cleanUrls)
Hero "Share BReeL. Keep 40%.", then How it works (4 steps), What you can promote ($10.80 per $27 OS sale, $18.80 per $47 OS sale, 40% of community memberships), an earnings calculator, perks (swipe kits, leaderboards, Whop payouts, learning the operator model), FAQ and contact. Every "Join" / "Become an Affiliate" button uses `siteConfig.links.affiliateJoin`.

### Phase 4 — Conversion & interaction hooks
- ✅ External links: `target="_blank"`, `rel="noopener"`, UTM per placement.
- Filter tabs for the Products section (vanilla JS, `aria-selected`, hash-synced).
- Scroll-triggered reveals for the new sections, reusing the existing `.anim` + `--d` system through IntersectionObserver.
- Optional: Calendly inline embed or popup widget, so applications happen on-site.
- Analytics: Vercel Analytics or Plausible, plus outbound-click events per `data-link` key.

### Phase 5 — Performance, SEO & deployment
- ✅ Meta description, OpenGraph and Twitter tags, `og.jpg`, favicon.
- Change `og:image` and `og:url` to absolute URLs once the domain is known.
- Add a `poster` frame to the background video (first-paint fallback on slow mobile), plus `preload="metadata"`.
- Lighthouse pass: font `preconnect` (done), check that the CDN font CSS from OnlineWebFonts isn't render-blocking.
- Deploy: push to GitHub, import to Vercel as "Other / static" with no build command, then add the custom domain.

## Open items
1. **Product covers**: the CSS recreates the Monetization Mastery covers for now. To use the real art, save the files as `assets/products/creator-monetization-os.webp` and `first-profitable-launch-os.webp`, and I'll swap them in.
2. **Whop community / affiliate signup URL**: set `siteConfig.links.affiliateJoin` in `main.js`. Every affiliate CTA points to @breel_ar DMs until then.
3. **Written testimonials**: the board only has client screenshots. Short quotes from 3zizpp and Toni (with permission) would go on the case cards.
4. **Deploy**: push to GitHub and import to Vercel as a static site (no build command). Then switch `og:image`/`og:url` to absolute URLs on the final domain.

## Run locally
```bash
python -m http.server 5173
```
