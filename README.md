# Personal Finance Tracker (MERN + Redis)

A full-stack finance tracker with JWT auth, RBAC, transactions CRUD, analytics with caching, rate limiting, and charts.

## Stack
- **Frontend**: React 18, Vite, Recharts, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Redis (caching), Swagger (API docs)
- **Security**: Helmet, xss-clean, express-mongo-sanitize, Joi validation
- **Performance**: Redis caching (analytics 15m, categories 1h), pagination, lazy-loading routes

## Quick Start

### Prereqs
- Node 18+
- MongoDB running locally (`mongodb://localhost:27017`)
- Redis running locally (`redis://localhost:6379`)

### 1) Backend
```bash
cd backend
cp .env.example .env
npm i
npm run seed   
npm run dev
```

API docs will be at: `http://localhost:4000/api/docs`

Demo credentials:
- admin: `admin@test.com` / `admin123`
- user: `user@test.com` / `user123`
- read-only: `viewer@test.com` / `viewer123`

### 2) Frontend
```bash
cd ../frontend
cp .env.example .env
npm i
npm run dev
```
Open `http://localhost:5173`.

## Notes
- RBAC enforced via JWT claims (role). Frontend disables mutating actions for `read-only` users.
- Rate limits:
  - Auth: 5 req / 15 min
  - Transactions: 100 req / hour
  - Analytics: 50 req / hour
- Caching:
  - Categories: 1 hour (`GET /api/categories`)
  - Analytics: 15 minutes (`GET /api/analytics?year=YYYY`), invalidated on transactions create/update/delete.

## Scripts
- `npm run seed` (backend): resets and seeds DB with demo users and transactions.

## Project Structure
```
finance-tracker-mern/
  backend/
    src/
      lib/ (db, redis)
      middleware/ (auth, rbac, rateLimiters, errorHandler)
      models/ (User, Transaction)
      routes/ (auth, transactions, analytics, categories, users)
      index.js
      seed.js
  frontend/
    src/
      state/ (AuthContext, ThemeContext)
      components/ (ProtectedRoute, RoleGate, charts/*)
      pages/ (Login, Register, Dashboard, Transactions, UsersAdmin)
      App.jsx, main.jsx, styles.css
```
