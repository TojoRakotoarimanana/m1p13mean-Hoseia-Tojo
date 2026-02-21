# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEAN stack shopping mall management system with three user roles: **admin**, **boutique** (shop owner), and **client**. The backend runs on port 3000, frontend on port 4200.

## Development Commands

### Backend
```bash
cd backend
npm start          # Start with nodemon (auto-reload)
npm run seed       # Seed test data (WARNING: deletes all existing data)
```

### Frontend
```bash
cd frontend
ng serve           # Dev server at http://localhost:4200
ng build           # Production build to dist/
ng test            # Run tests with Vitest
```

## Architecture

### Backend: Route → Controller → Service → Model

- **Routes** (`backend/routes/`): Define endpoints and apply middleware. Mount at `/api/*` (except `/users`).
- **Controllers** (`backend/controllers/`): Handle HTTP req/res, delegate logic to services.
- **Services** (`backend/services/`): Business logic, database operations.
- **Models** (`backend/models/index.js`): All Mongoose schemas in one file with a shared `softDeletePlugin`.

### Frontend: Angular 21 Standalone Components

- **`app/core/services/`**: All HTTP services. API URLs are hardcoded to `http://localhost:3000/api/*` — no `environment.ts` files.
- **`app/core/guards/`**: `adminGuard`, `boutiqueGuard`, `clientGuard` exported from `role.guard.ts`. `redirectIfLoggedIn` in `auth.guard.ts`.
- **`app/core/interceptors/auth.interceptor.ts`**: Automatically attaches `Bearer` token to all HTTP requests.
- **`app/features/`**: Feature components organized by domain (auth, catalog, dashboard, products, shops).

### Authentication Flow
- JWT stored in `localStorage` under keys `auth_token` and `auth_user`.
- Backend: `middleware/auth.js` verifies token; `middleware/roles.js` enforces role access with `checkRole(allowedRoles)`.
- Frontend: `auth.service.ts` manages session via `BehaviorSubject<user$>`.

### Soft Deletes
All models use `softDeletePlugin` — call `.softDelete(userId)` instead of `.deleteOne()`. Deleted documents are excluded from queries by default; pass `{ includeDeleted: true }` to bypass.

### File Uploads
Images go through `backend/utils/upload.js` (multer + sharp): max 5 images, 5MB each, resized to 1000×1000 JPEG (quality 82), saved to `backend/public/uploads/products/` with UUID filenames.

### UI Framework
PrimeNG v21 with Aura theme. CSS layer order: `tailwind-base → primeng → tailwind-utilities`. `MessageService` is provided globally in `app.config.ts`.

## Environment & Configuration

Backend reads from `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/mean
CORS_ORIGIN=http://localhost:4200
JWT_SECRET=<set this>
```

## Test Credentials (after seeding)

| Role     | Email                         | Password      |
|----------|-------------------------------|---------------|
| Admin    | admin@mall.com                | Admin123!     |
| Boutique | boutique1@mall.com (1–10)     | Boutique123!  |
| Client   | client1@test.com (1–5)        | Client123!    |

## Sprint Structure

Work is split across two developers per sprint:
- **Dev1**: Admin & Boutique features
- **Dev2**: Client & Infrastructure features

Current branch convention: `sprint{N}-dev{1|2}`
