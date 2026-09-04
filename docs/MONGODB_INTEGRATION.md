# MongoDB integration

## Current collections

- users
- recipients
- orders
- auditlogs
- settings

## Request flow

1. React sends credentials or data to the Express API.
2. Express authenticates the JWT where required.
3. Mongoose validates and writes the relevant MongoDB document.
4. Admin-only routes enforce roles.
5. Sensitive admin mutations create audit events.
6. React receives only the API response; MongoDB credentials never reach the browser.

## Environment variables

Frontend:
`VITE_API_URL`

Backend:
`MONGODB_URI`
`JWT_SECRET`
`CLIENT_ORIGIN`
`PORT`

## Production hardening

- Use a secret manager rather than `.env` on production hosts.
- Restrict MongoDB Atlas network access.
- Use separate databases for development/staging/production.
- Enable backups and point-in-time recovery.
- Add field-level encryption for sensitive identity/payment data.
- Do not store raw PINs, passwords, OTPs or biometric data.
- Do not expose arbitrary MongoDB queries from the admin UI.
- Use controlled admin endpoints and least privilege.
- Add schema migrations/validation and automated tests.

## Financial data

Orders are operational records. They are not a substitute for an accounting ledger.

For real money, add:
`ledger_accounts`, `ledger_transactions`, `ledger_entries`, `settlements`, `reconciliation_runs`, and provider-specific payment/payout records.

Customer balances must be derived from immutable ledger postings, not from a freely editable MongoDB balance field.
