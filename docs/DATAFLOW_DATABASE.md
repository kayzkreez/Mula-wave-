# MulaWave dataflow, database model and control framework

## 1. Reference UX flow

Mama Money publicly describes a flow built around phone/PIN registration, personal details, identity document, selfie verification, recipient setup, payout method, amount, payment and transfer tracking. Its current Zimbabwe route supports wallet/cash/bank payout options through its partner network; exact availability depends on route and product. MulaWave should use these interaction patterns as UX references, not copy branding or implementation.

## 2. MulaWave end-to-end flow

```text
STARTUP
  |
  +--> REGISTER
  |      |
  |      +--> phone number
  |      +--> OTP verification
  |      +--> identity document
  |      +--> document upload validation
  |      +--> selfie/liveness
  |      +--> KYC / sanctions / PEP screening
  |      +--> PIN creation
  |      +--> account activation / review
  |
  +--> LOGIN
         |
         +--> phone + PIN
         +--> authentication
         +--> device biometric confirmation
         +--> DASHBOARD
                 |
                 +--> SEND MONEY
                 |      |
                 |      +--> destination country
                 |      +--> payout method
                 |      |      +--> cash
                 |      |      +--> bank account
                 |      |              +--> bank name
                 |      |              +--> account details
                 |      +--> USD amount
                 |      +--> server quote
                 |      +--> select recipient
                 |      +--> CREATE ORDER NUMBER
                 |      +--> payment instruction
                 |      +--> payment reconciliation
                 |      +--> AML/fraud checks
                 |      +--> payout
                 |      +--> settlement
                 |      +--> receipt/notifications
                 |
                 +--> TRANSACTIONS
                 +--> RECIPIENTS
                 +--> CHECK RATES
                 +--> PROFILE
                 +--> SECURITY
                 +--> NOTIFICATIONS
                 +--> FAQS
                 +--> CASH LOCATIONS
                 +--> CONTACT
                 +--> SIGN OUT
```

## 3. Database conventions

Every table/collection must include:

- `id`: UUID/string primary identifier
- `created_at`: UTC timestamp
- `updated_at`: UTC timestamp
- `created_by`: actor/service ID where applicable
- `updated_by`: actor/service ID where applicable
- `version`: integer optimistic-concurrency version
- `status`: controlled enum where applicable
- `metadata`: JSON object for non-critical extensibility
- `tenant_id` / `country_code` where global partitioning is required

Never use mutable display names as primary identifiers.

## 4. Identity

### users
- `user_id`
- `phone_e164`
- `phone_verified`
- `phone_verified_at`
- `email`
- `email_verified`
- `email_verified_at`
- `full_name`
- `date_of_birth`
- `country_of_residence`
- `nationality`
- `account_status`
- `kyc_status`
- `risk_level`
- `pin_hash`
- `pin_hash_algorithm`
- `failed_login_count`
- `locked_until`
- `last_login_at`
- `remember_device_enabled`
- `preferred_language`
- `preferred_currency`
- `created_at`
- `updated_at`

Do not store raw PIN/password.

### identity_documents
- `document_id`
- `user_id`
- `document_type`
- `document_number_ciphertext`
- `document_number_hash`
- `issuing_country`
- `issue_date`
- `expiry_date`
- `document_file_id`
- `document_file_hash`
- `document_status`
- `verification_provider`
- `verification_reference`
- `verified_at`
- `rejection_reason_code`

### selfies
- `selfie_id`
- `user_id`
- `file_id`
- `file_hash`
- `liveness_provider`
- `liveness_reference`
- `liveness_score`
- `verification_status`
- `captured_at`

## 5. Verification

### verification_cases
- `verification_case_id`
- `user_id`
- `case_type`
- `status`
- `provider`
- `provider_reference`
- `started_at`
- `completed_at`
- `decision`
- `reason_code`
- `reviewer_id`

### otp_verifications
- `otp_id`
- `user_id`
- `channel`
- `destination_hash`
- `purpose`
- `code_hash`
- `attempt_count`
- `expires_at`
- `verified_at`
- `status`

Never store plaintext OTPs.

### email_verifications
- `verification_id`
- `user_id`
- `email_hash`
- `token_hash`
- `purpose`
- `expires_at`
- `verified_at`
- `status`

## 6. Sequence / uniqueness checker

Use a dedicated `identity_uniqueness_checks` or service layer.

Fields:
- `check_id`
- `entity_type`
- `field_type`
- `normalized_value_hash`
- `country_code`
- `user_id`
- `match_status`
- `match_reference`
- `checked_at`
- `provider`
- `decision`

Examples:
- phone number uniqueness
- email uniqueness
- identity document number uniqueness by issuing country/type
- bank account uniqueness where policy requires it
- recipient phone uniqueness
- beneficiary account uniqueness

Use normalized/hash comparison for sensitive values. Do not expose raw identifiers in logs.

## 7. Recipients

### recipients
- `recipient_id`
- `owner_user_id`
- `full_name`
- `phone_e164`
- `country_code`
- `payout_method`
- `status`
- `verification_status`
- `is_favourite`
- `created_at`
- `updated_at`

### recipient_bank_accounts
- `recipient_bank_account_id`
- `recipient_id`
- `bank_id`
- `bank_name`
- `account_name`
- `account_number_ciphertext`
- `account_number_hash`
- `branch_code_ciphertext`
- `account_type`
- `currency`
- `verification_status`
- `verified_at`
- `verification_reference`

### payout_locations
- `location_id`
- `country_code`
- `partner_id`
- `name`
- `address`
- `city`
- `latitude`
- `longitude`
- `opening_hours`
- `supported_payout_types`
- `status`

## 8. Countries, corridors and partners

### countries
- `country_code`
- `name`
- `currency_code`
- `status`
- `kyc_requirements_version`
- `supported_payout_methods`

### corridors
- `corridor_id`
- `source_country`
- `destination_country`
- `status`
- `supported_currencies`
- `supported_payout_methods`
- `min_amount`
- `max_amount`
- `daily_limit`
- `monthly_limit`
- `compliance_profile_id`

### partners
- `partner_id`
- `legal_name`
- `partner_type`
- `country_code`
- `licence_reference`
- `integration_type`
- `status`
- `risk_rating`
- `contract_version`

## 9. Quotes and rates

### exchange_rates
- `rate_id`
- `source_currency`
- `destination_currency`
- `rate`
- `buy_rate`
- `sell_rate`
- `effective_from`
- `effective_to`
- `source`
- `status`
- `approved_by`

### fee_rules
- `fee_rule_id`
- `corridor_id`
- `fee_type`
- `percentage`
- `fixed_amount`
- `currency`
- `min_fee`
- `max_fee`
- `effective_from`
- `effective_to`
- `status`

### quotes
- `quote_id`
- `user_id`
- `corridor_id`
- `source_amount`
- `source_currency`
- `fee_amount`
- `fee_currency`
- `fx_rate`
- `destination_amount`
- `destination_currency`
- `payout_method`
- `rate_source`
- `expires_at`
- `status`
- `created_at`

The quote used to create an order must be immutable/auditable.

## 10. Orders

### orders
- `order_id` UUID
- `order_number` human-readable unique reference
- `user_id`
- `recipient_id`
- `quote_id`
- `source_country`
- `destination_country`
- `source_currency`
- `destination_currency`
- `send_amount`
- `fee_amount`
- `fx_rate`
- `receive_amount`
- `payout_method`
- `payment_method`
- `status`
- `compliance_status`
- `fraud_status`
- `payment_status`
- `payout_status`
- `created_at`
- `expires_at`
- `completed_at`
- `cancellation_reason`

## 11. Order events

### order_events
- `event_id`
- `order_id`
- `event_type`
- `previous_status`
- `new_status`
- `actor_type`
- `actor_id`
- `reason_code`
- `ip_address_hash`
- `device_id_hash`
- `created_at`
- `metadata`

This is the audit trail for the customer-visible timeline.

## 12. Payments

### payments
- `payment_id`
- `order_id`
- `user_id`
- `payment_method`
- `provider`
- `provider_reference`
- `amount`
- `currency`
- `status`
- `received_at`
- `reconciled_at`
- `failure_code`

### payment_attempts
- `attempt_id`
- `payment_id`
- `provider_reference`
- `requested_amount`
- `status`
- `response_code`
- `created_at`

## 13. Payouts

### payouts
- `payout_id`
- `order_id`
- `partner_id`
- `recipient_id`
- `payout_method`
- `amount`
- `currency`
- `provider_reference`
- `status`
- `initiated_at`
- `completed_at`
- `failure_code`

## 14. Double-entry ledger

### ledger_accounts
- `ledger_account_id`
- `account_type`
- `owner_type`
- `owner_id`
- `currency`
- `status`

### ledger_transactions
- `ledger_transaction_id`
- `order_id`
- `transaction_type`
- `reference`
- `currency`
- `status`
- `posted_at`

### ledger_entries
- `ledger_entry_id`
- `ledger_transaction_id`
- `ledger_account_id`
- `direction`
- `amount`
- `currency`
- `entry_sequence`
- `created_at`

The ledger, not the frontend, is authoritative for financial balances.

## 15. Wallets

### wallets
- `wallet_id`
- `user_id`
- `currency`
- `status`
- `ledger_account_id`
- `created_at`

### wallet_snapshots
- `snapshot_id`
- `wallet_id`
- `available_amount`
- `pending_amount`
- `as_of`
- `ledger_transaction_id`

## 16. Compliance

### aml_alerts
- `alert_id`
- `user_id`
- `order_id`
- `rule_id`
- `risk_score`
- `severity`
- `status`
- `created_at`
- `assigned_to`
- `resolution_code`
- `resolved_at`

### sanctions_checks
- `check_id`
- `subject_type`
- `subject_id`
- `provider`
- `provider_reference`
- `screening_timestamp`
- `match_status`
- `risk_level`
- `review_status`

### pep_checks
- `check_id`
- `user_id`
- `provider`
- `match_status`
- `risk_level`
- `review_status`
- `checked_at`

### source_of_funds
- `source_of_funds_id`
- `user_id`
- `order_id`
- `source_type`
- `declared_amount`
- `currency`
- `evidence_file_id`
- `verification_status`
- `reviewer_id`

## 17. Fraud

### fraud_alerts
- `fraud_alert_id`
- `user_id`
- `order_id`
- `rule_id`
- `score`
- `severity`
- `device_risk`
- `velocity_risk`
- `payment_risk`
- `recipient_risk`
- `geo_risk`
- `status`
- `resolution`

### devices
- `device_id`
- `user_id`
- `device_fingerprint_hash`
- `platform`
- `app_version`
- `first_seen_at`
- `last_seen_at`
- `trusted`
- `blocked`

## 18. Authentication and security

### sessions
- `session_id`
- `user_id`
- `device_id`
- `created_at`
- `expires_at`
- `revoked_at`
- `ip_hash`

### biometric_credentials
- `credential_id`
- `user_id`
- `device_id`
- `credential_provider`
- `credential_reference`
- `created_at`
- `revoked_at`

Store references/credential IDs, not biometric images or raw biometric templates.

## 19. Notifications

### notifications
- `notification_id`
- `user_id`
- `channel`
- `template_id`
- `title`
- `body`
- `status`
- `sent_at`
- `read_at`
- `order_id`

### notification_preferences
- `user_id`
- `sms_enabled`
- `email_enabled`
- `push_enabled`
- `transaction_alerts`
- `security_alerts`
- `marketing_enabled`

## 20. Documents / files

### files
- `file_id`
- `owner_type`
- `owner_id`
- `storage_provider`
- `storage_key`
- `content_type`
- `size_bytes`
- `sha256`
- `encryption_key_reference`
- `scan_status`
- `retention_until`
- `created_at`

Actual documents belong in encrypted object storage, not directly in normal database rows.

## 21. Admin

### admin_users
- `admin_user_id`
- `email`
- `phone`
- `name`
- `status`
- `mfa_enabled`
- `last_login_at`

### roles
- `role_id`
- `name`
- `description`

### permissions
- `permission_id`
- `resource`
- `action`

### admin_user_roles
- `admin_user_id`
- `role_id`

### audit_logs
- `audit_id`
- `actor_type`
- `actor_id`
- `action`
- `resource_type`
- `resource_id`
- `before_hash`
- `after_hash`
- `ip_hash`
- `device_hash`
- `reason_code`
- `created_at`

## 22. Treasury and reconciliation

### treasury_accounts
- `treasury_account_id`
- `country_code`
- `currency`
- `partner_id`
- `available_balance`
- `pending_balance`
- `minimum_operating_balance`
- `status`

### settlements
- `settlement_id`
- `partner_id`
- `corridor_id`
- `currency`
- `gross_amount`
- `fees`
- `net_amount`
- `settlement_date`
- `status`
- `bank_reference`

### reconciliation_runs
- `reconciliation_id`
- `provider`
- `run_date`
- `source_total`
- `ledger_total`
- `difference`
- `status`
- `resolved_by`
- `resolved_at`

## 23. Admin viewing/control model

Admin dashboard should expose role-limited modules:

```text
SUPER ADMIN
  Users
  Roles
  System configuration
  Country/corridor configuration
  Audit

COMPLIANCE
  KYC
  AML
  Sanctions
  PEP
  Source of funds
  Suspensions

OPERATIONS
  Orders
  Payments
  Payouts
  Customer support
  Branches / agents

FINANCE
  Ledger
  Reconciliation
  Treasury
  Settlements
  Reports

SECURITY
  Sessions
  Devices
  Security events
  Incident records
```

A support agent must not be able to edit a ledger entry or approve an AML case merely because they can view an order.

## 24. Required backend prompts/validations

Every form needs explicit validation.

Examples:

- Phone: E.164 normalization, uniqueness check, OTP verification
- Email: normalization, uniqueness check, verification
- ID: document type + issuing country + document number + expiry + duplicate check
- Selfie: file type/size + malware scan + liveness provider
- Recipient: required name, phone, country, payout method
- Bank: bank selected from controlled list, account fields validated, verification where available
- Amount: decimal precision, min/max, currency, corridor limits
- Quote: server-generated, expiry enforced
- Payment: amount must match order requirements; provider reference required
- Order: unique order number generated server-side
- Admin actions: RBAC + MFA for privileged operations + reason code for sensitive changes

## 25. Status enums

### User
`PENDING_KYC | ACTIVE | SUSPENDED | CLOSED`

### KYC
`NOT_STARTED | PENDING | VERIFIED | REJECTED | MANUAL_REVIEW`

### Order
`CREATED | QUOTE_EXPIRED | AWAITING_PAYMENT | PAYMENT_RECEIVED | COMPLIANCE_REVIEW | APPROVED | PAYOUT_PROCESSING | PAYOUT_COMPLETED | SETTLED | FAILED | CANCELLED | REFUNDED | SUSPENDED`

### Payment
`PENDING | RECEIVED | RECONCILED | FAILED | REFUNDED`

### Payout
`PENDING | PROCESSING | COMPLETED | FAILED | REVERSED`

## 26. Global country expansion

Do not hard-code Zimbabwe or India into business logic.

Use:

```text
country
currency
corridor
payout_method
payment_method
fee_rule
exchange_rate
kyc_requirement
limit_rule
partner
compliance_profile
```

This lets the same program support:

`Zimbabwe → India`

then later:

`Zimbabwe → South Africa`
`Zimbabwe → Botswana`
`South Africa → Zimbabwe`
etc.

The UI reads configuration from the backend.

## 27. Security baseline

- TLS everywhere
- encrypted database/storage
- field-level protection for highly sensitive identifiers
- Argon2id or equivalent password/PIN hashing
- MFA for administrators
- device/session management
- RBAC
- least privilege
- secrets manager
- WAF/API gateway
- rate limiting
- idempotency keys for financial requests
- server-side validation
- immutable audit trail
- encrypted backups
- malware scanning for uploads
- dependency/security scanning
- vulnerability management
- penetration testing
- incident-response process

## 28. Idempotency

Every payment/order/payout API must accept an idempotency key.

Example:

`POST /v1/orders`

Header:

`Idempotency-Key: <unique-client-generated-key>`

A retry must not create two transfers.

## 29. Critical rule

The frontend can request an action.

The backend decides whether that action is valid.

```text
Browser
  ↓
API
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Risk / compliance
  ↓
Ledger / transaction
  ↓
Partner
  ↓
Result
  ↓
Audit + notification
```
