# AquaFarm Ledger

AquaFarm Ledger is a production-style full-stack AquaTech SaaS application for fish farm stock, pond, feed, water quality, mortality, harvest planning, alerts, reports, and cost analytics management.

## Highlights

- Premium purple / white / black SaaS UI with aqua accents
- Role-based authentication: Farm Owner/Admin, Manager, Technician
- Pond profiles, fish batches, feed logs, water quality logs, mortality logs, harvest plans, costs, alerts and reports
- Smart calculators for water quality score, survival rate, biomass, harvest revenue, profit and ROI
- Automatic alert generation for dangerous pH, low oxygen, high temperature, high mortality and harvest readiness
- Demo seed data for Sri Lankan aquaculture examples: Tilapia, Catfish, Carp and Prawns

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Hook Form, Zod, Lucide React, Framer Motion, React Hot Toast.

Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Helmet, CORS, express-rate-limit, Zod validation.

## Demo Credentials

After seeding:

```txt
Email: owner@aquafarm.dev
Password: Demo@12345
Role: admin
```

## Folder Structure

```txt
backend/
  src/config controllers middleware models routes seed services utils validators server.js
frontend/
  src/components context hooks layouts pages routes services utils constants styles
```

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

### backend/.env

```txt
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aquafarm_ledger
JWT_SECRET=change_this_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### frontend/.env

```txt
VITE_API_URL=http://localhost:5000/api
```

## API Overview

- `/api/auth` register, login, me
- `/api/ponds` pond CRUD
- `/api/batches` fish batch CRUD
- `/api/feed-logs` feed log CRUD
- `/api/water-quality` water quality CRUD
- `/api/mortality` mortality CRUD
- `/api/harvests` harvest plan CRUD
- `/api/costs` cost CRUD
- `/api/alerts` read/resolve/delete alerts
- `/api/reports` dashboard and analytics reports

## Author

Lithira Deenath Liyanage — Full-stack / AI portfolio project.
