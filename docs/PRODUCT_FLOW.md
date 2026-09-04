# MulaWave product flow

## Customer

1. Landing page
2. Register / log in
3. KYC
4. Add recipient
5. Select destination + payout method
6. Enter amount
7. Receive quote
8. Confirm order
9. Pay
10. Payment reconciliation
11. Compliance/risk screening
12. Payout
13. Notification
14. Track / receipt

## Backend state machine

CREATED
→ KYC_VERIFIED
→ AWAITING_PAYMENT
→ PAYMENT_RECEIVED
→ COMPLIANCE_REVIEW
→ APPROVED
→ PAYOUT_PROCESSING
→ PAYOUT_COMPLETED
→ SETTLED

Exception states:
PAYMENT_FAILED
PAYOUT_FAILED
REFUNDED
CANCELLED
SUSPENDED

## Design rule

The frontend must never be the authority for:
- balances
- transaction completion
- payment verification
- compliance approval
- payout confirmation
- exchange-rate truth

Those decisions belong to the backend and controlled operational systems.
