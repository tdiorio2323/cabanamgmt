# Repository Guidelines

## Project Structure & Module Organization
Source routes, server actions, and helpers live in `src/app`, following the Next.js app-router segment layout. Shared UI primitives sit in `src/components`, while reusable utilities (Supabase clients, Zustand stores, Stripe helpers) belong in `src/lib`. Place static media in `public`, and mirror every schema change with a matching migration under `supabase/migrations`. Add tests next to their targets, e.g., `src/components/Stepper.test.tsx`.

## Build, Test, and Development Commands
Run `npm install` to refresh dependencies before coding. Use `npm run dev` to start the Turbopack dev server at `http://localhost:3000`. Execute `npm run lint` prior to commits to satisfy the Next.js ESLint gate. Build production artifacts with `npm run build`, and confirm them locally via `npm run start`.

## Coding Style & Naming Conventions
Write TypeScript with 2-space indentation and trailing commas in multiline literals. Prefer Tailwind utility classes; add scoped CSS only when composition demands it. Name React components, hooks, and Zustand stores with PascalCase filenames such as `useBookingStore.ts`. Keep route handlers lower-case and hyphenated to align with URL segments.

## Testing Guidelines
Automated tests are not yet wired, so document manual QA steps for each change. When adding tests, colocate `*.test.tsx` files alongside components and focus on booking flows and Supabase data transforms. Always run `npm run lint` after introducing tests.

## Commit & Pull Request Guidelines
Follow the "Type: short summary" format for commits, keeping each change independently revertible. PRs should explain the problem, outline the solution, attach screenshots for UI updates, note Supabase migration impacts, list new environment variables, and link relevant tracking issues.

## Security & Configuration Tips
Store secrets like `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `STRIPE_SECRET_KEY` in `.env.local`. Review Supabase RLS policies and Stripe webhook handling whenever authentication or payments code changes. Remove debug logging before merging.
