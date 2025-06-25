# OSSIdeas - Open Source Startup Discovery Platform

A comprehensive platform for discovering startup opportunities based on open source projects, built with React, TypeScript, Supabase, and Stripe.

## Features

- 🔍 **Idea Discovery**: Browse curated startup ideas based on popular open source projects
- 👤 **User Authentication**: Secure login with email/password and Google OAuth
- 💳 **Stripe Integration**: Subscription management and one-time payments
- 📊 **Advanced Filtering**: Filter ideas by category, opportunity score, license, and more
- ❤️ **Save Ideas**: Bookmark interesting ideas for later review
- 📱 **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- 🔒 **Secure**: Row-level security with Supabase and secure payment processing

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe (Subscriptions & One-time payments)
- **Build Tool**: Vite
- **Deployment**: Netlify (frontend), Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

3. Update the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (for edge functions)
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### Supabase Setup

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` folder
3. Set up Google OAuth (optional):
   - Go to Authentication > Providers in Supabase dashboard
   - Enable Google provider
   - Add your Google OAuth credentials

### Stripe Setup

1. Create a Stripe account and get your API keys
2. Create products and prices in Stripe dashboard
3. Update `src/stripe-config.ts` with your actual Stripe price IDs
4. Set up webhook endpoint pointing to your Supabase edge function:
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

#### Frontend (Netlify)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

#### Backend (Supabase)
Edge functions are automatically deployed when you push to your Supabase project.

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase client)
├── types/              # TypeScript type definitions
├── data/               # Mock data and constants
└── stripe-config.ts    # Stripe product configuration

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

## Key Features

### Authentication
- Email/password authentication
- Google OAuth integration
- User onboarding flow
- Profile management

### Subscription Management
- Multiple subscription tiers
- Annual/monthly billing
- One-time purchases
- Subscription status tracking

### Idea Discovery
- Advanced filtering system
- Search functionality
- Categorized ideas
- Opportunity scoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@ossideas.com or create an issue in this repository.