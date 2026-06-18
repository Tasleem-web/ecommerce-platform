# Microservices

Two small, independent Express services that share a `shared/` library.
No message broker — services communicate via HTTP and trust JWTs issued by `user-service`.

## Layout

```
microservices/
├── shared/              # logger, errors, JWT, Sequelize factory, Swagger, middleware
├── user-service/        # register / login / me           (port 4001, db: users_db)
└── product-service/     # CRUD products (admin-protected) (port 4002, db: products_db)
```

## Patterns demonstrated

- **Database per service** — each service owns its MySQL schema, no cross-service joins.
- **Shared library** — cross-cutting concerns (logging, errors, auth, Sequelize, Swagger) live in `shared/` and are imported by relative path.
- **JWT auth across services** — `user-service` signs tokens with `JWT_SECRET`; `product-service` verifies them with the same secret using `shared/middleware/auth`.
- **Role-based access control** — `requireRole('admin')` guards write endpoints on `product-service`.
- **Correlation IDs** — `requestLogger` middleware assigns/propagates `x-correlation-id` for distributed tracing.
- **Centralized error handling** — controllers throw typed `HttpError`s; the shared `errorHandler` formats them as JSON.
- **Input validation** — Joi schemas in each service's `validators/`.
- **API docs per service** — Swagger UI exposed at `/docs` on each service.
- **Rate limiting + Helmet + CORS** baked into every service.

## Prerequisites

- MySQL running locally on `localhost:3306` with credentials matching `config/.env.development`.
- Create the two schemas once:

  ```sql
  CREATE DATABASE users_db;
  CREATE DATABASE products_db;
  ```

  (Sequelize will create tables on startup via `sequelize.sync()`.)

## Run

From `backend/`:

```powershell
# Both services together
npm run dev:microservices

# Or individually
npm run dev:user-service
npm run dev:product-service
```

- User service:    http://localhost:4001/docs
- Product service: http://localhost:4002/docs

## Try it

```powershell
# 1. Register
curl -X POST http://localhost:4001/users/register `
  -H "Content-Type: application/json" `
  -d '{"email":"alice@example.com","password":"password123","name":"Alice"}'

# 2. Login -> copy the `token`
curl -X POST http://localhost:4001/users/login `
  -H "Content-Type: application/json" `
  -d '{"email":"alice@example.com","password":"password123"}'

# 3. List products (public)
curl http://localhost:4002/products

# 4. Create a product (admin role required — promote your user in MySQL:
#    UPDATE users_db.users SET roles='user,admin' WHERE email='alice@example.com';
#    then re-login to get a new token with the admin role)
curl -X POST http://localhost:4002/products `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <token>" `
  -d '{"name":"Keyboard","price":99.99,"stock":10}'
```

## Env vars (`config/.env.development`)

| Var                    | Default        | Used by                |
|------------------------|----------------|------------------------|
| `MYSQL_HOST`           | localhost      | both                   |
| `MYSQL_PORT`           | 3306           | both                   |
| `MYSQL_USER`           | root           | both                   |
| `MYSQL_PASSWORD`       | *(empty)*      | both                   |
| `JWT_SECRET`           | change-me-...  | both                   |
| `JWT_EXPIRES_IN`       | 1h             | user-service           |
| `USER_SERVICE_PORT`    | 4001           | user-service           |
| `USER_DB_NAME`         | users_db       | user-service           |
| `PRODUCT_SERVICE_PORT` | 4002           | product-service        |
| `PRODUCT_DB_NAME`      | products_db    | product-service        |
