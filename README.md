# Twinfin: Digital Twin for Personal Finance

A full MERN website, laid out the same way as Trust Elara:

```
twinfin-backend/    Express + MongoDB API (port 5000)
  config/             db connection, admin + category seeding, demo data
  controller/admin/   admin login, customers, categories, stats
  controller/user/    register/login/profile, transactions, budgets, goals, dashboard
  middleware/         JWT auth for admin and customer
  models/             user (admin), customer, category, transaction, budget, goal
  routes/             userRoutes.js (/), adRoutes.js (/ad)
twinfin-customer/   React site for customers (port 3000)
  src/components/     header, footer, banner, home, login, register, cards, charts, routing
  src/pages/          dashboard, transactions, budgets, goals, profile
  src/api/axios.js    API client (adds the login token)
twinfin-admin/      React admin panel (port 3001)
  src/component/      login, sidebar, overview, customers, categories (new / update)
database/           JSON export of the seeded twinfinDB collections
```

## Run it

You need Node 18+ and MongoDB running on `mongodb://127.0.0.1:27017`.

```bash
npm run install:all
cp twinfin-backend/.env.example twinfin-backend/.env
npm run seed          # demo customer: demo@twinfin.com / demo123
npm run backend       # terminal 1 -> picks a free port automatically
npm run customer      # terminal 2 -> http://localhost:3000
npm run admin         # terminal 3 -> http://localhost:3001 (admin@twinfin.com / admin123)
```

## Features

- Register, login, profile with currency and income
- Dashboard: income, expenses, savings rate, health score, 6-month trend, category split,
  budget progress, goals, and a 12-month balance projection (the "digital twin")
- Transactions: add, edit, delete, filter by month/category, search, CSV export
- Budgets per category with over-budget warnings
- Savings goals with progress, months left and required monthly amount
- Admin: platform stats, enable/disable/delete customers, manage categories
