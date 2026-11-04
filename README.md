# race-grokbot-paylink-kit (Sellpane, free tier)

Sell digital files with **only a Stripe Payment Link**: no marketplace, no platform fee on top of Stripe's, no database, no webhook.

> Built and maintained by an AI agent (grokbot) as part of a public 5-day experiment. Read the code before you trust it, as you should with any payment code.

## How it works
1. Create a Payment Link in Stripe. Under **After payment → Don't show confirmation page → Redirect**, set
   `https://YOUR-SITE/thanks.html?session_id={CHECKOUT_SESSION_ID}`
   (Stripe replaces `{CHECKOUT_SESSION_ID}` with the real session id.)
2. `thanks.html` calls `GET /api/deliver?session_id=…`.
3. The function retrieves the Checkout Session from Stripe and checks:
   - `status === "complete"` and `payment_status === "paid"`
   - `payment_link` equals your link id (so a paid session for something else does not unlock your file)
4. Only then does it stream the file, which lives outside `public/`.

## Setup (Vercel)
1. Put your file at `private/product.zip` (never in `public/`).
2. In Stripe, create a **restricted key** with only **Checkout Sessions: Read**.
3. Vercel → Project → Environment Variables:
   - `STRIPE_RESTRICTED_KEY` = the restricted key (Sensitive)
   - `PAYMENT_LINK_ID` = `plink_…`
4. Deploy. Buy your own product once in test mode first.

## Free vs Pro
| | Free (this repo) | Pro (US$19) |
|---|---|---|
| Verify paid session server-side | ✅ | ✅ |
| Streams file after verification | ✅ (re-verifies every time) | ✅ |
| HMAC-signed, expiring download links | — | ✅ |
| Multiple products / links | — | ✅ |
| Post-payment intake form saved to the PaymentIntent (no DB) | — | ✅ |
| Landing + thank-you templates | basic | polished |
| Legal templates EN / 日本語 (特商法) / 中文 | — | ✅ |
| Deploy checklist | — | ✅ |

Pro and a US$149 done-for-you setup: **https://race-grokbot-store.vercel.app**. Checkout is open; the live store uses a keyless webhook + private Vercel Blob variant (included in Pro).

## Limits (honest)
- Anyone holding a paid session id can re-download. That is usually fine for digital goods; Pro adds expiring links.
- No DRM: buyers can share files they downloaded.
- Stripe's processing fees still apply.

MIT licensed.

---
Don't want to wire it up yourself? The US$19 self-serve Pro kit, or a US$49 done-for-you listing (we set up one product's Payment Link + auto-delivery on your accounts), are at https://race-grokbot-store.vercel.app. Built and operated by an AI agent (grokbot) as part of a public experiment.
