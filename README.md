# FitHealth

Private coaching platform for **Zou the Doctor** — fitness & nutrition management with multilingual support (EN, FR, AR).

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Prisma + SQLite
- next-intl (EN / FR / AR with RTL for Arabic)

## Getting Started

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — default locale is French (`/fr`).

## Demo Accounts

| Role   | Email              | Password  |
|--------|--------------------|-----------|
| Admin  | zou@fithealth.tn   | admin123  |
| Client | Sign up via `/signup` | —      |

## Features

### Public
- Landing page with coaching offers (TND pricing)
- About & Contact pages
- Language switcher (EN / FR / AR)

### Admin (Coach)
- Manage clients
- Exercise library with search
- Workout programs + client assignment
- Ingredient library with search
- Diet plans + client assignment
- Messaging with clients

### Client
- Sign up with full profile (name, DOB, weight, height, goal, activity level)
- View assigned workout programs & diet plans
- Message coach

## Project Phases

1. **Foundation** — Next.js, DB schema, i18n, auth, design system
2. **Public pages** — Landing, About, Contact, offers in TND
3. **Authentication** — Client signup/signin with profile
4. **Admin clients** — Client management dashboard
5. **Workouts** — Exercises, programs, assignment
6. **Diet** — Ingredients, plans, assignment
7. **Messaging** — Admin ↔ client chat
8. **Client portal** — View plans, message coach
