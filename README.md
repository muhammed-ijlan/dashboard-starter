# Admin Dashboard Starter

A production-ready admin dashboard starter built with React 19, TypeScript, and Vite. Designed to be fully customizable — swap in your own brand, API, and domain logic.

## Features

- **Dashboard** — Stat cards, charts, recent activity feed, and system alerts
- **User Center** — Device/user management with search, pagination, and platform analytics
- **Resource Management** — Record monitoring with status management and detail views
- **Transaction Center** — Transaction history with daily volume charts and Excel export
- **App Management** — CRUD registry with drag-and-drop category ordering
- **Settings** — Configurable settings page with card-based layout
- **Administrator** — Admin account management with role-based permission system
- **System Operations** — Service health, logs, and alert management
- **Admin Profile** — Account settings, password management, and 2FA

### Built-in Capabilities

- Role-based access control with granular per-module permissions
- Internationalization — English and Chinese out of the box (add more locales easily)
- Auto-refreshing data with configurable polling intervals
- Export to Excel across all data tables
- Password strength validation
- Responsive design with mobile-friendly pagination
- Global error notifications for API calls
- 2FA setup and verification flow

## Tech Stack

| Category      | Technology               |
| ------------- | ------------------------ |
| Framework     | React 19 + TypeScript    |
| Build Tool    | Vite                     |
| UI Components | Ant Design 6             |
| Styling       | Tailwind CSS 4           |
| Server State  | TanStack React Query     |
| Client State  | Zustand                  |
| Routing       | React Router 7           |
| Charts        | Recharts                 |
| Icons         | Lucide React             |
| i18n          | i18next                  |
| Validation    | Zod                      |
| Testing       | Vitest + Testing Library |
| Export        | XLSX                     |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment file and set your API URL
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

| Variable            | Description          |
| ------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend API base URL |

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start development server       |
| `npm run build`     | Type check + production build  |
| `npm run lint`      | Run ESLint                     |
| `npm run lint:fix`  | Run ESLint with auto-fix       |
| `npm run typecheck` | Run TypeScript compiler check  |
| `npm run test`      | Run tests in watch mode        |
| `npm run test:run`  | Run tests once                 |
| `npm run coverage`  | Run tests with coverage report |

## Customization

### Branding
- **Name & logo**: Edit `src/components/layout/Sidebar/SidebarHeader.tsx`
- **App title**: Edit `src/i18n/locales/en/common.json` → `appTitle`
- **Auth page name**: Edit `src/i18n/locales/en/auth.json` → `auth.platformName`

### Navigation
- Add or remove sidebar items in `src/components/layout/Sidebar/SidebarConfig.ts`
- Add new routes in `src/routes/paths.ts` and `src/routes/index.tsx`

### Permissions
- Define permission keys in `src/constants/permissionKeys.ts`
- Map permissions to modules in `src/constants/permissions.ts`

### Theme
- Ant Design token overrides: `src/theme.ts`
- Tailwind CSS variables: `src/index.css` (`@theme` block)

### API
- Configure base URL in `.env`
- Add new API modules in `src/api/`
- Add React Query hooks in `src/hooks/`

## Project Structure

```
src/
  api/           # API modules, HTTP client, endpoints, query keys
  components/
    layout/      # Domain-specific components (Dashboard, Wallet, etc.)
    shared/      # Reusable components (Form, Table, AppButton, etc.)
  constants/     # App constants, color configs, permission mappings
  hooks/         # Custom hooks wrapping React Query calls
  i18n/          # i18next config, namespaces, locale files (en/zh)
  pages/         # Route-level page components (lazy-loaded)
  routes/        # Route definitions, PrivateRoute, PermissionGuard
  schemas/       # Zod validation schema factories
  services/      # Auth service (login flow, permission resolution)
  store/         # Zustand auth store
  types/         # Shared TypeScript interfaces
  utils/         # Utility functions (formatting, Excel export)
```

## Code Quality

- **Pre-commit hooks**: ESLint fix + TypeScript check via Husky + lint-staged
- **Commit format**: Conventional commits enforced by commitlint (`type(scope): subject`)
- **Path alias**: `@/*` maps to `src/*`
