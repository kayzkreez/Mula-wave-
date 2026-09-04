# Field registry

This registry is the source-of-truth checklist for UI forms and backend DTOs.

## Registration
- phone_e164
- phone_country_code
- phone_otp
- email (optional/required by market configuration)
- email_otp (when enabled)
- full_name
- date_of_birth
- nationality
- country_of_residence
- document_type
- document_number
- document_issuing_country
- document_issue_date
- document_expiry_date
- document_file
- selfie_file
- liveness_result
- pin
- pin_confirmation
- terms_accepted
- privacy_accepted

## Login
- phone_e164
- pin
- remember_me
- device_id
- biometric_confirmation

## Recipient
- full_name
- phone_e164
- country_code
- payout_method
- bank_id
- bank_name
- account_name
- account_number
- branch_code
- account_type
- currency
- recipient_consent / verification status where required

## Quote
- source_country
- destination_country
- source_currency
- destination_currency
- payout_method
- amount
- quote_id
- fee
- exchange_rate
- recipient_amount
- quote_expiry

## Order
- quote_id
- recipient_id
- payment_method
- order_number
- payment_reference
- order_status

## Admin
- actor_id
- role
- permission
- action
- reason_code
- target_resource
- target_resource_id
- before_state
- after_state
- timestamp
- device/session reference
