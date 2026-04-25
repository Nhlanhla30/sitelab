# SiteLab

**Construction operations platform built for South African SMEs.**

Manage quotes, track projects, keep clients in the loop — and stop running your construction business from WhatsApp.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (site photos)
- **Hosting**: Vercel
- **Payments**: Yoco / PayFast (Phase 2)
- **Messaging**: WhatsApp Business API (Phase 2)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 22+)
- npm 10+
- Git
- A Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sitelab.git
cd sitelab

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your Supabase credentials in .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages (landing, pricing, about)
│   ├── (dashboard)/        # Authenticated app (quotes, projects, etc.)
│   ├── (auth)/             # Login, register
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── marketing/          # Marketing page components
│   ├── dashboard/          # Dashboard components
│   └── shared/             # Shared across marketing & dashboard
├── config/                 # Site configuration, pricing plans
├── hooks/                  # Custom React hooks
├── lib/                    # Supabase client, utilities
├── styles/                 # Global CSS, design tokens
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions (currency, dates, etc.)
```

## Development Roadmap

- **Phase 1 (MVP)**: Quote Builder, Project Tracker, Client Portal
- **Phase 2**: WhatsApp Integration, Invoicing & Payments
- **Phase 3**: Mobile App (React Native), Team Management
- **Phase 4**: Materials Tracking, Compliance & Safety
- **Phase 5**: Supplier Marketplace, AI Features, SADC Expansion

## License

Proprietary. All rights reserved.
