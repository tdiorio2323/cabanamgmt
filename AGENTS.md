# Repository Guidelines

## Project Structure & Module Organization
- Application routes, server actions, and helpers live under `src/app`, mirroring the Next.js app-router segments.
- Shared UI primitives belong in `src/components`; reusable clients, stores, and helpers sit in `src/lib`.
- Place static media in `public`; match every schema change with a migration in `supabase/migrations`.
- Colocate tests with their targets, e.g., `src/components/Stepper.test.tsx` for `src/components/Stepper.tsx`.

## Build, Test, and Development Commands
- `npm install` refreshes dependencies before coding.
- `npm run dev` starts the Turbopack dev server at `http://localhost:3000`.
- `npm run lint` runs the project ESLint gate and must pass before commits.
- `npm run build` produces production artifacts; validate them locally with `npm run start`.

## Coding Style & Naming Conventions
- Write TypeScript with 2-space indentation and trailing commas in multiline literals.
- Prefer Tailwind utility classes; fall back to scoped CSS modules only when composition demands it.
- Name React components, hooks, and Zustand stores with PascalCase (`useBookingStore.ts`); route handlers stay lower-case and hyphenated to match URL segments.

## Testing Guidelines
- Automated tests are not yet wired; document manual QA steps for each change.
- Add new tests beside the subject file using `*.test.tsx`; focus on booking flows and Supabase data transforms.
- After introducing tests, run `npm run lint` to ensure lint rules still pass.

## Commit & Pull Request Guidelines
- Format commits as `Type: short summary`, keeping each change independently revertible.
- Pull requests explain the problem, outline the solution, attach UI screenshots when relevant, note Supabase migration impacts, list new environment variables, and link tracking issues.

## Security & Configuration Tips
- Store secrets such as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `STRIPE_SECRET_KEY` in `.env.local` (never commit them).
- Review Supabase RLS policies and Stripe webhook handling whenever authentication or payments code changes.
- Remove debug logging before merging and confirm no sensitive data is logged.
