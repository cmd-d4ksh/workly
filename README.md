# Workly

A coworking space marketplace. Teams submit what kind of workspace they need — city, team size, budget, move-in date — and get matched against listed spaces with a transparent, rules-based score. Operators get a CRM-style dashboard for the leads that come in.

Built with Next.js (App Router), TypeScript, Tailwind, and shadcn/ui.

## Running it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully on seeded, in-memory demo data out of the box — no environment variables required to try it out. Log in at `/login` and use one of the quick-access buttons to try the seeker, operator, or admin views.

## Connecting real services

Copy `.env.example` to `.env.local` and fill in whichever of these you have — each one is optional and the app degrades gracefully without it:

- **Supabase** — real auth + Postgres instead of the in-memory seed data
- **Stripe** — real operator subscription checkout (test mode keys are fine)
- **Resend** — real transactional email (new lead notifications, welcome emails)
- **Mapbox** — interactive map on the search and space detail pages

Without these, the app uses a mock data layer (`src/lib/data`) backed by generated seed data (`src/lib/mock-data`) — 25 spaces, 10 operators, 50 leads, and reviews across six cities.

## Project structure

```
src/
  app/                  routes (App Router)
    (marketing)/        public pages — home, about, pricing-free "for business" page, etc.
    (auth)/             login, signup, forgot password
    dashboard/          seeker dashboard
    operator/           operator CRM
    admin/              admin console
    actions/            server actions (mutations)
  components/           UI, grouped by feature area
  lib/
    matching.ts         the lead-to-space scoring engine
    data/                data access layer (swap-in point for Supabase)
    mock-data/           seed data generation
```

## Matching engine

Leads are scored against spaces on six weighted factors — location (30%), workspace type (20%), budget (20%), capacity (15%), amenities (10%), availability (5%) — producing a 0–100 score and a Hot/Warm/Cold-style band. It's a plain scoring function (`src/lib/matching.ts`), not a black box.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```
