# MAQO ATAP — EV Owner Solar Landing Page

Next.js 14 (App Router) single-page landing site targeting EV owners, built
to match MAQO's light, blue/amber brand palette.

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel (vercel.com/new) — it auto-detects Next.js, no
   config needed.
3. Deploy.

## Notes

- The lead form (`#assessment`) currently just shows a local "request
  received" confirmation on submit — no backend is wired up. To connect it
  to your existing Supabase `atap_leads` table / `submitLead` Server Action,
  turn `app/page.tsx`'s `handleSubmit` into a call to a Server Action, or add
  an API route under `app/api/`.
- Palette and layout are based on publicly available info about MAQO's
  branding (blue + amber, light background) — swap the CSS variables at the
  top of `app/globals.css` if you have exact brand hex values from the
  official logo file.
- The calculator (`#calculator`) is an illustrative estimate only, computed
  client-side from the TNB bill and a selected charging-time pattern.
