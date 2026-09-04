# Backend API contract skeleton

## Authentication

`POST /v1/auth/register/start`
- phone_e164

`POST /v1/auth/otp/verify`
- verification_id
- otp

`POST /v1/auth/login`
- phone_e164
- pin
- device_id

`POST /v1/auth/biometric/verify`
- session_id
- credential_reference

## KYC

`POST /v1/kyc/documents`
- document_type
- issuing_country
- document_number
- file_id

`POST /v1/kyc/selfie`
- file_id

`GET /v1/kyc/status`

## Rates

`GET /v1/corridors`
`POST /v1/quotes`
- source_currency
- destination_currency
- destination_country
- payout_method
- amount

## Recipients

`GET /v1/recipients`
`POST /v1/recipients`
`PATCH /v1/recipients/:id`
`DELETE /v1/recipients/:id`

## Orders

`POST /v1/orders`
- quote_id
- recipient_id
- payment_method
- idempotency_key

`GET /v1/orders/:order_number`

## Payments

`POST /v1/payments/instructions`
`POST /v1/payments/webhooks/:provider`

Webhooks must be authenticated, signature-verified and idempotent.

## Admin

`GET /v1/admin/orders`
`GET /v1/admin/kyc/cases`
`GET /v1/admin/aml/alerts`
`GET /v1/admin/reconciliation`
`GET /v1/admin/audit`

All admin routes require RBAC and appropriate MFA/step-up authentication.


## v4 implemented endpoints

The integrated development backend currently implements:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/users/me
- GET/POST/PATCH/DELETE /api/recipients
- POST/GET /api/orders
- GET /api/orders/:orderNumber
- PATCH /api/orders/:id/status
- GET /api/admin/overview
- GET /api/admin/audit
- GET /api/admin/settings
- PUT /api/admin/settings/:key
- GET /api/users
- PATCH /api/users/:id/role

The frontend `src/api.js` calls these endpoints using the JWT stored in localStorage for this development foundation. For production, consider secure HTTP-only cookies and CSRF protection.
