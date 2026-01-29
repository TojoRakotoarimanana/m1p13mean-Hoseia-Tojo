# MEAN Stack Project Instructions

## Project Context
This is a MEAN stack application (MongoDB, Express, Angular, Node.js) split into `backend/` and `frontend/` directories.
- **Frontend**: Angular 21 (Latest/Standalone), PrimeNG, Tailwind CSS.
- **Backend**: Express.js, Mongoose, JWT Auth.
- **Database**: MongoDB (local instance `m1p13mean`).

## Architecture & patterns

### Backend
- **Structure**: Route-Service-Model pattern.
  - **Routes** (`backend/routes/`): Handle HTTP req/res, validations, and call services.
  - **Services** (`backend/services/`): Contain all business logic.
  - **Models** (`backend/models/index.js`): Centralized model definitions with shared plugins (e.g., `softDeletePlugin`).
- **Authentication**: JWT-based. Secret key defaults to dev value in `auth.service.js` if `process.env.JWT_SECRET` is missing.
- **API conventions**:
  - Most API routes are prefixed with `/api` (e.g., `/api/auth`, `/api/shops`).
  - **Exception**: `/users` is at the root level (see `backend/app.js`).
  - Responses are standard JSON. Errors return `{ message, status }`.

### Frontend
- **Framework**: Angular 21 with Standalone Components.
- **UI Library**: PrimeNG 21 + Tailwind CSS integration.
- **HTTP**: Services wrap `HttpClient` with Hardcoded URLs (e.g., `http://localhost:3000/...`).
- **Auth Handling**:
  - `AuthService` (`core/services/auth.service.ts`) manually manages `localStorage` (`auth_token`, `auth_user`).
  - No global HTTP interceptor observed; auth headers may need manual addition or implementation.
- **Styling**: Global styles in `styles.css` setup CSS layers for PrimeNG and Tailwind overrides.

## Critical Developer Workflows

### Running the Project
1.  **Backend**:
    ```bash
    cd backend
    npm start  # Runs `nodemon ./bin/www` on port 3000
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    ng serve   # Runs on http://localhost:4200
    ```

### Common Tasks
- **New Feature**:
    1. Define Mongoose model in `backend/models/index.js` (apply `softDeletePlugin` if needed).
    2. Create Service `backend/services/feature.service.js`.
    3. Create Route `backend/routes/feature.js` and mount in `backend/app.js`.
    4. Generate Angular feature: `ng g c features/feature-name`.
    5. Add frontend service in `frontend/src/app/core/services/`.

## Specific Conventions
- **Soft Deletes**: Use the `softDelete(userId)` method on Mongoose models instead of `remove()`.
- **Validation**: `auth.service.js` handles validation manually (e.g., `confirmPassword` check).
- **Environment**: No `environment.ts` usage found; API URLs are hardcoded in services. Maintain this pattern or refactor consistently.
