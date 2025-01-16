# TypeForm Clone

A beautiful form builder created with Next.js 14, Supabase, and TailwindCSS.

## Features

- 🎨 Modern and responsive UI
- 📝 Multiple question types (text, choice, email, number, date, rating)
- 🔒 Authentication with Google
- 💾 Data storage with Supabase
- 🎯 Form validation
- ⌨️ Keyboard navigation
- 📱 Mobile-friendly design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth & Database)
- TailwindCSS
- Zustand (State Management)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

```sql
-- Forms table
create table forms (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  questions jsonb not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Form responses table
create table form_responses (
  id uuid default uuid_generate_v4() primary key,
  form_id uuid references forms(id) not null,
  answers jsonb not null,
  user_id uuid references auth.users(id),
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Deployment

This project is deployed on Vercel. To deploy your own:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!
