# Admin Console and RBAC

## Administrative principle

The admin console is a privileged operational application. It is not simply another page in the customer frontend in production.

Production recommendation:

```text
Customer app
     |
Customer API
     |
Customer DB / ledger

Admin web app
     |
Admin API
     |
RBAC + MFA + audit
     |
Operational DB / read models
     |
Ledger / compliance / treasury
```

## Admin modules

1. Overview
2. Admin users
3. Roles & permissions
4. Customers
5. KYC / AML
6. Orders
7. Ledger
8. Payments & payouts
9. Treasury
10. Reconciliation
11. Countries & corridors
12. Rates & fees
13. Notification templates
14. Security
15. Audit logs
16. System settings

## Role model

Default roles:

- Super Administrator
- Compliance Officer
- Finance Officer
- Operations Manager
- Customer Support
- Auditor

Use permissions as `resource + action`.

Examples:

```text
customers.read
customers.update
kyc.read
kyc.review
aml.read
aml.resolve
orders.read
orders.update
payments.read
payouts.execute
ledger.read
ledger.post
treasury.read
treasury.update
rates.read
rates.update
roles.read
roles.assign
audit.read
system.update
```

## Separation of duties

Do not allow one role to perform every high-risk action.

Examples:

- Customer Support: read customer/order data; no payout approval.
- Compliance: KYC/AML decisions; no ledger posting.
- Finance: reconciliation/treasury; no KYC approval.
- Operations: order processing; no role assignment.
- Auditor: read-only.
- Super Administrator: controlled emergency/system authority.

## Admin action requirements

For sensitive operations:

1. Authenticate admin.
2. Check RBAC permission.
3. Require step-up MFA where appropriate.
4. Validate the request server-side.
5. Require reason code.
6. Execute transaction atomically.
7. Write immutable audit event.
8. Return the result without exposing unnecessary sensitive data.

## Data access

"All database can be accessed" must mean **authorised operational access**, not unrestricted raw SQL from the browser.

The admin API should expose controlled views/search endpoints for:
- customers
- KYC
- orders
- recipients
- payments
- payouts
- ledger
- treasury
- reconciliation
- compliance
- fraud
- notifications
- audit

Direct database credentials must never be shipped to the frontend.

## Configuration

The admin console can manage:
- enabled countries
- enabled corridors
- currencies
- payout methods
- payment methods
- banks
- fees
- FX-rate sources
- limits
- KYC requirements
- AML rules
- notification templates
- security policies
- maintenance state

Every configuration change must be versioned and audited.

## Global configuration

Do not hard-code values in React.

Example backend objects:

```json
{
  "corridorId": "ZW-IN",
  "sourceCountry": "ZW",
  "destinationCountry": "IN",
  "sourceCurrency": "USD",
  "destinationCurrency": "INR",
  "payoutMethods": ["CASH", "BANK"],
  "status": "ACTIVE",
  "configurationVersion": 12
}
```

The frontend reads configuration from the backend.
