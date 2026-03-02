# MEAN Stack Project Instructions

## Project Context
This is a MEAN stack shopping mall application (MongoDB, Express, Angular, Node.js) split into `backend/` and `frontend/` directories.
- **Frontend**: Angular 21 Standalone Components, PrimeNG 21, Tailwind CSS
- **Backend**: Express.js, Mongoose, JWT Auth
- **Database**: MongoDB local (`m1p13mean`)
- **Roles**: admin, boutique (shop owner), client

## Architecture & Patterns

### Backend: Route → Controller → Service → Model

**Separation of Concerns** (see [backend/routes/products.js](backend/routes/products.js), [backend/controllers/product.controller.js](backend/controllers/product.controller.js), [backend/services/product.service.js](backend/services/product.service.js)):
- **Routes**: Define endpoints, apply role middleware at router level with `router.use(boutiqueOnly)` NOT on individual routes
- **Controllers**: Thin try/catch wrappers that delegate to services, handle HTTP response
- **Services**: ALL business logic, throw errors with `.status` property (e.g., `error.status = 400`)
- **Models**: ALL in one file [backend/models/index.js](backend/models/index.js) with shared `softDeletePlugin`

**Soft Delete Pattern** (CRITICAL):
```javascript
// Call .softDelete(userId) instead of .deleteOne()
await Product.findById(id).then(doc => doc.softDelete(req.user.id));

// Query deleted documents by passing option
await Model.find({}).setOptions({ includeDeleted: true });
```
All models auto-exclude `deletedAt != null` unless `{ includeDeleted: true }` is passed.

**Error Handling Convention**:
```javascript
// Services must set .status property on errors
const error = new Error('shopId, name et price sont obligatoires.');
error.status = 400;
throw error;
```

**Authentication & Authorization** ([backend/middleware/roles.js](backend/middleware/roles.js)):
```javascript
// Import pre-built role checkers
const { adminOnly, boutiqueOnly, clientOnly, boutiqueOrAdmin } = require('../middleware/roles');

// Apply at router level (preferred)
router.use(boutiqueOnly);

// Or per-route
router.get('/:id', adminOnly, Controller.getById);
```

**File Uploads** ([backend/utils/upload.js](backend/utils/upload.js)):
- Max 5 images, 5MB each
- Auto-resizes to 1000×1000, converts to JPEG quality 82
- Saves to `backend/public/uploads/products/` with UUID filenames

**API Routes** ([backend/app.js](backend/app.js)):
- **EXCEPTION**: `/users` at root (not `/api/users`)
- All others: `/api/auth`, `/api/shops`, `/api/products`, `/api/catalog`, `/api/cart`, `/api/orders`, `/api/admin`, `/api/notifications`, `/api/categories`, `/api/shop/orders`

### Frontend: Angular 21 Standalone

**Component Structure**:
```typescript
@Component({
  selector: 'app-my-products',
  standalone: true,  // NO NgModule
  imports: [CommonModule, FormsModule, CardModule, TableModule],  // Import everything directly
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'  // Singular, not styleUrls
})
```

**PrimeNG + Tailwind** ([frontend/src/app/app.config.ts](frontend/src/app/app.config.ts)):
```typescript
// CSS layer order CRITICAL for overrides
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      cssLayer: { order: 'tailwind-base, primeng, tailwind-utilities' }
    }
  }
}),
MessageService  // Provided globally
```

**Functional Guards** ([frontend/src/app/core/guards/role.guard.ts](frontend/src/app/core/guards/role.guard.ts)):
```typescript
// Factory function returns CanActivateFn
export const roleGuard = (allowedRoles: string[]): CanActivateFn => { ... };

// Pre-built exports
export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const boutiqueGuard: CanActivateFn = roleGuard(['boutique']);
export const clientGuard: CanActivateFn = roleGuard(['client']);
```

**Authentication** ([frontend/src/app/core/services/auth.service.ts](frontend/src/app/core/services/auth.service.ts), [frontend/src/app/core/interceptors/auth.interceptor.ts](frontend/src/app/core/interceptors/auth.interceptor.ts)):
- `BehaviorSubject<user$>` for reactive auth state
- localStorage keys: `auth_token`, `auth_user`
- Auth interceptor auto-adds `Bearer` token to all HTTP requests
- Auto-redirects to `/login` on 401 errors

**Service Pattern**:
```typescript
// Environment-based URLs
private apiUrl = `${environment.apiUrl}/api/products`;

// HttpParams for query strings
let httpParams = new HttpParams();
Object.keys(params).forEach(key => {
  if (params[key] != null && params[key] !== '') {
    httpParams = httpParams.set(key, params[key]);
  }
});

// FormData for uploads
create(data: FormData): Observable<any> {
  return this.http.post(this.apiUrl, data);
}

// Body in DELETE for soft delete
remove(id: string, userId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, { body: { deletedByUserId: userId } });
}
```

## Build and Test

**Backend**:
```bash
cd backend
npm start           # Development with nodemon on port 3000
npm run start:prod  # Production
npm run seed        # ⚠️ WARNING: DELETES ALL DATA then seeds test accounts
```

**Frontend**:
```bash
cd frontend
ng serve            # Dev server on port 4200
ng build            # Production build
ng test             # Vitest unit tests
```

**Test Credentials** (after `npm run seed`):
- Admin: `admin@mall.com` / `Admin123!`
- Boutiques: `boutique1@mall.com` to `boutique10@mall.com` / `Boutique123!`
- Clients: `client1@test.com` to `client5@test.com` / `Client123!`

## Project Conventions

**New Feature Workflow**:
1. Add model schema in [backend/models/index.js](backend/models/index.js) with `softDeletePlugin`
2. Create service in `backend/services/feature.service.js` (business logic + error handling)
3. Create controller in `backend/controllers/feature.controller.js` (thin wrapper)
4. Create route in `backend/routes/feature.js` with role middleware
5. Mount route in [backend/app.js](backend/app.js) at `/api/feature`
6. Generate Angular component: `ng g c features/feature-name`
7. Create service in `frontend/src/app/core/services/feature.service.ts`
8. Add routes in [frontend/src/app/app.routes.ts](frontend/src/app/app.routes.ts) with guards

**Environment Configuration**:
- Backend: `.env` file with `MONGO_URI`, `CORS_ORIGIN`, `JWT_SECRET`
- Frontend: `src/environments/environment.ts` (dev: `http://localhost:3000`) and `environment.prod.ts` (production URL)

## Key Reference Files
- [backend/models/index.js](backend/models/index.js) - All models with softDeletePlugin
- [backend/middleware/roles.js](backend/middleware/roles.js) - Role-based middleware exports
- [backend/routes/products.js](backend/routes/products.js) - Example route with role middleware
- [backend/services/product.service.js](backend/services/product.service.js) - Service error handling pattern
- [frontend/src/app/core/guards/role.guard.ts](frontend/src/app/core/guards/role.guard.ts) - Functional guard factory
- [frontend/src/app/app.config.ts](frontend/src/app/app.config.ts) - PrimeNG + interceptor setup
