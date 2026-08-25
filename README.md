# SiteLab

A construction operations platform built for South African SMEs. Manage quotes,
track projects, and keep clients in the loop, so you can stop running your
construction business from WhatsApp.

Status: work in progress. Phase 1 (MVP) is under active development.

## Tech stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Storage: Supabase Storage (site photos)
- Hosting: Vercel
- Payments: Yoco / PayFast (Phase 2)
- Messaging: WhatsApp Business API (Phase 2)

## Getting started

### Prerequisites

- Node.js 18 or later (22 or later recommended)
- npm 10 or later
- Git
- A Supabase account (the free tier works)

### Installation

git clone https://github.com/Nhlanhla30/sitelab.git
cd sitelab
npm install
cp .env.example .env.local

Fill in your Supabase credentials in .env.local

npm run dev


Open http://localhost:3000 to see the app.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Development roadmap

- Phase 1 (MVP): quote builder, project tracker, client portal
- Phase 2: WhatsApp integration, invoicing and payments
- Phase 3: mobile app (React Native), team management
- Phase 4: materials tracking, compliance and safety
- Phase 5: supplier marketplace, AI features, SADC expansion

## License

Proprietary. All rights reserved.
