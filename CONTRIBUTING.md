# Contributing to Cabana Management Platform

Thank you for your interest in contributing to the Cabana Management Platform!

## Development Workflow

### Prerequisites

- Node.js 20.x (see `.nvmrc`)
- pnpm 10.15.1+ (configured in `package.json`)
- Supabase account and project

### Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd cabanamgmt
   nvm use  # Use Node version from .nvmrc
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Database Setup**
   ```bash
   supabase login
   supabase link --project-ref dotfloiygvhsujlwzqgv
   supabase db push
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```

### Before Committing

Run these commands to ensure code quality:

```bash
# Fast verification (lint + typecheck)
pnpm run verify:fast

# Full build test
pnpm run build

# Optional: Run tests (requires test setup)
pnpm run test:all
```

## Code Style

### TypeScript

- **Strict Mode**: Enabled with `noUncheckedIndexedAccess`
- **Naming**: PascalCase for components, camelCase for functions/variables
- **No `any`**: Use proper types or `unknown`

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use proper TypeScript interfaces for props

### Imports

- Use absolute imports with `@/` prefix
- Group imports: external → internal → types
- Use default exports for components, named exports for utilities

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build process, tooling, dependencies

**Examples:**
```
feat(auth): add password reset functionality
fix(dashboard): correct KPI calculation
docs: update README with CI badge
chore(deps): upgrade Next.js to 15.5.4
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation updates

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write clear, concise code
   - Add tests if applicable
   - Update documentation

3. **Verify Changes**
   ```bash
   pnpm run verify:fast
   pnpm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/my-feature
   ```
   - Open PR on GitHub
   - Fill out PR template
   - Link related issues

6. **PR Requirements**
   - ✅ All CI checks pass
   - ✅ Code reviewed by maintainer
   - ✅ No merge conflicts
   - ✅ Documentation updated (if needed)

## Testing

### Unit Tests
```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test -w
```

### E2E Tests
```bash
# Setup (first time only)
cp .env.test.local.example .env.test.local
# Edit with test credentials

# Run E2E tests
pnpm run test:e2e

# Run with UI
pnpm run test:ui
```

## Areas to Avoid

**Do NOT edit these without explicit approval:**
- `/api/*` routes (vendor integrations pending)
- `/supabase/functions/*` (Supabase edge functions)
- External SDK integrations (Onfido, Checkr, DocuSign, etc.)
- Webhook handlers (require vendor keys)

**Safe areas for contribution:**
- Frontend components and UI
- Documentation
- Tests (non-network)
- Build configuration
- Developer tooling

## Questions?

- Check `CLAUDE.md` for project architecture
- Read `docs/TESTING.md` for testing guide
- Review existing code for patterns
- Ask in PR comments or issues

## Code of Conduct

- Be respectful and professional
- Follow existing code patterns
- Write clear commit messages
- Test your changes
- Document complex logic

Thank you for contributing! 🎉
