# Gemini Project Analysis: Cabana Management

## Project Overview

This is a full-stack web application built with [Next.js](https://nextjs.org/) and [React](https://react.dev/). It serves as a platform for managing exclusive memberships, likely for a service called "Cabana". The application handles user authentication, invitations, member vetting, and access to gated content or features.

**Key Technologies:**

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI:** React, Tailwind CSS, shadcn/ui components
*   **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Authentication:** Supabase Auth
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Linting:** ESLint

**Architecture:**

The project follows a standard Next.js architecture.

*   The frontend is composed of React components located in `src/components/` and pages/routes in `src/app/`.
*   The backend logic is handled by Next.js API routes within `src/app/api/`.
*   The database schema is defined in `src/lib/schema.ts` using Drizzle ORM and synchronized with the Supabase PostgreSQL database through migration files in `supabase/migrations/`.
*   Supabase is used as the primary backend-as-a-service, providing the database, user authentication, and other backend functionalities.

## Building and Running

Follow these steps to get the development environment running.

**1. Prerequisites:**

*   Node.js and npm (or a compatible package manager)
*   [Supabase CLI](https://supabase.com/docs/guides/cli)

**2. Installation:**

Install the project dependencies:

```bash
npm install
```

**3. Environment Setup:**

The project requires environment variables to connect to Supabase. It is likely that a `.env.local.example` or similar file should be created and renamed to `.env.local` with the appropriate Supabase project URL and anon key.

**TODO:** Create a `.env.local.example` file with placeholder variables for future developers.

**4. Database Setup:**

The database schema is managed with Supabase migrations. To set up the local database, you may need to run a command like:

```bash
supabase db reset
```

This will apply all the migrations in the `supabase/migrations` directory.

**5. Running the Development Server:**

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

**Available Scripts:**

*   `npm run dev`: Starts the development server.
*   `npm run build`: Creates a production build of the application.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using ESLint.

## Development Conventions

*   **Database Migrations:** Database schema changes should be managed through Supabase migrations. Developers should use the Supabase CLI to create new migration files.
*   **Styling:** The project uses Tailwind CSS for styling, with UI components from `shadcn/ui`. Utility classes should be used for styling whenever possible.
*   **State Management:** The nature of state management (e.g., React Context, Zustand, Redux) is not immediately clear from the file analysis, but `src/lib/store.ts` suggests a centralized store might be in use.
*   **Authentication:** Interacting with the user's session should be done via the Supabase helper functions found in `src/lib/supabase.ts` and related files.
*   **Code Quality:** Code is kept clean and consistent with ESLint. It is recommended to run `npm run lint` before committing changes.
