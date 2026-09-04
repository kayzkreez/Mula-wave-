# MulaWave — React + MongoDB Integrated v4

This repository now contains the MulaWave customer/admin frontend and the Node.js/Express MongoDB backend in one GitHub-ready project.

## Architecture

React/Vite frontend
→ HTTPS API
→ Node.js + Express
→ MongoDB Atlas

## Included

### Customer
- Registration
- Login
- JWT session
- Secure PIN hashing
- Recipients stored in MongoDB
- Transfer order creation
- Transaction history
- Order tracking

### Admin
- Live MongoDB customer/user data
- Admin overview
- Role assignment
- Audit logs
- Orders
- System/rate settings persisted through backend
- RBAC middleware

## Local setup

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Set:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/mulawave
JWT_SECRET=use-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Then:

```bash
npm run dev
```

Test:

```text
http://localhost:5000/health
```

### Frontend

From the project root:

```bash
npm install
cp .env.example .env
npm run dev
```

The frontend uses:

```env
VITE_API_URL=http://localhost:5000/api
```

## First admin user

Registration creates a `customer` role by default. For development, promote one user directly in MongoDB:

```text
role = super_admin
```

Then log in again. In production, do not expose unrestricted role promotion; use controlled bootstrap procedures, MFA, approval and audit.

## Deployment

Deploy the frontend and backend separately.

Frontend:
- Vercel or another static hosting provider.

Backend:
- Render, Railway, Fly.io, AWS, Azure, etc.

Set the frontend's `VITE_API_URL` to the deployed backend HTTPS URL.

In MongoDB Atlas:
- create a database user
- restrict Network Access appropriately
- use TLS
- never commit `.env`
- use separate development/staging/production databases

## Financial-production warning

This is an engineering foundation, not a licensed remittance/payment system.

Before real customer funds are processed, add:
- authoritative server-side quotes/rates
- payment-provider adapters and signed webhooks
- payout-provider adapters
- KYC/AML/sanctions/PEP controls
- fraud/risk engine
- immutable double-entry ledger
- treasury and reconciliation
- idempotency keys
- transaction limits
- MFA/WebAuthn
- encrypted document storage
- secrets/KMS and key rotation
- immutable audit controls
- backups/disaster recovery
- regulatory approvals/partnering applicable to the operating jurisdictions
