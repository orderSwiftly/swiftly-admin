Perfect, that's all I need. Here's the document:

---

**Swiftly Finance Dashboard — Screen Specifications**
*Working document for frontend team*

---

## System State (Dummy Data)

Before the screens, here is the hypothetical state of the system this document is built from. All numbers are real calculations based on a ₦200 subtotal per order.

**Per order pricing breakdown:**
- Subtotal: ₦200
- Service fee: ₦50
- Delivery fee: ₦600
- Grand total: ₦850
- Customer pays (+ 2% FLW fee): ₦867
- Flutterwave fee: ₦17
- VAT on fee (7.5%): ₦1.28
- Amount settled: ₦865.72
- Vendor receives: ₦200
- Swiftly gross earnings: ₦665.72

**Orders:**

| # | Date | Status | Rider | Payout Status |
|---|------|--------|-------|---------------|
| ORD-001 | Yesterday | Paid | Rider A | Paid |
| ORD-002 | Yesterday | Paid | Rider B | Paid |
| ORD-003 | Yesterday | Cancelled | None | N/A |
| ORD-004 | Today | Paid | Rider A | Unpaid |
| ORD-005 | Today | Cancelled | None | N/A |

**Rider Payouts:**

| Batch | Date | Rider | Orders | Amount | FLW Fee | Status |
|-------|------|-------|--------|--------|---------|--------|
| BATCH-001 | Yesterday | Rider A | ORD-001 | ₦200 | ₦10.75 | Paid |
| BATCH-001 | Yesterday | Rider B | ORD-002 | ₦200 | ₦10.75 | Paid |
| BATCH-002 | Tonight 10pm | Rider A | ORD-004, ORD-005... | ₦400 | TBD | Scheduled |

Wait — ORD-005 is cancelled so no rider. Rider A is owed for ORD-004 only = ₦200 unpaid. Let me correct:

| Batch | Date | Rider | Orders | Amount | Status |
|-------|------|-------|--------|--------|--------|
| BATCH-001 | Yesterday | Rider A | ORD-001 | ₦200 | Paid |
| BATCH-001 | Yesterday | Rider B | ORD-002 | ₦200 | Paid |
| BATCH-002 | Tonight 10pm | Rider A | ORD-004 | ₦200 | Scheduled |

---

## Screens

---

### Screen 1 — Main Dashboard

**Purpose:** Answer the 5 operational questions within 5 seconds.

**Section 1 — Executive Snapshot (4 KPI cards)**

**Card 1: Gross Platform Volume**
```
Gross Platform Volume
₦1,734        (today)
₦2,601        (yesterday)
-33.3%        vs yesterday
```
*Calculation: Today = ORD-004 + ORD-005 attempts. Only paid orders count. ORD-004 = ₦867 charged. ORD-005 cancelled so ₦0. Total today = ₦867. Yesterday = ORD-001 + ORD-002 = ₦867 × 2 = ₦1,734.*

Wait, cancelled orders were never charged. Correcting:
- Today GPV: ₦867 (ORD-004 only)
- Yesterday GPV: ₦1,734 (ORD-001 + ORD-002)
- Change: -50%

```
Gross Platform Volume
₦867          today
₦1,734        yesterday
-50%          vs yesterday
```

**Card 2: Swiftly Net Revenue**
```
Swiftly Net Revenue
₦465.72       today
₦910.69       yesterday
-48.8%        vs yesterday
```
*Calculation:*
- *Today: Swiftly gross (ORD-004) = ₦665.72 minus rider payout due = ₦200. Net = ₦465.72*
- *Yesterday: (₦665.72 × 2) minus (₦200 + ₦10.75) × 2 rider payouts = ₦1,331.44 − ₦421.50 = ₦909.94*

**Card 3: Rider Liability**
```
Rider Liability
₦200          unpaid
1 order       pending tonight's payout
₦0            processing
```
*Rider A is owed ₦200 for ORD-004. Payout scheduled for tonight 10pm.*

**Card 4: Failed Transactions**
```
Failed Transactions
1             cancelled today
₦867          affected (what they would have paid)
1             cancelled yesterday
```
*ORD-003 and ORD-005 were cancelled before payment.*

---

**Section 2 — Money Flow**

A simple left-to-right flow showing where money is at any point in time. No graph, just numbers.

```
Customers Paid        Vendor Allocation       Rider Allocation       Swiftly Gross
₦2,601  (lifetime)  →  ₦400  (lifetime)   →   ₦400  (lifetime)   →  ₦1,331 (lifetime)
₦867    (today)     →  ₦200  (today)      →   ₦0    (paid today) →  ₦466   (today)
```

*Note: Vendor allocation = sum of order subtotals on paid orders. Flutterwave pays vendors directly via subaccount split. Rider allocation = completed rider payouts only (not pending).*

---

**Section 3 — Settlement Status**

**Pending Rider Payouts table:**

| Rider | Orders | Amount | Pending Since | Status |
|-------|--------|--------|---------------|--------|
| Rider A | 1 order (ORD-004) | ₦200 | Today | Unpaid — scheduled tonight |

**Failed Transfers table:**

| Date | Who | Amount | Reason | Action |
|------|-----|--------|--------|--------|
| — | — | — | — | — |

*No failed transfers in this dummy dataset.*

---

### Screen 2 — Orders

**Purpose:** Full order list with financial data per order.

**Filters:** Date range, payment status, payout status

**Table:**

| Order | Date | Customer | Amount Charged | Vendor Cut | Swiftly Gross | Payment Status | Payout Status |
|-------|------|----------|---------------|------------|---------------|----------------|---------------|
| ORD-001 | Yesterday | — | ₦867 | ₦200 | ₦665.72 | Paid | Rider Paid |
| ORD-002 | Yesterday | — | ₦867 | ₦200 | ₦665.72 | Paid | Rider Paid |
| ORD-003 | Yesterday | — | ₦0 | ₦0 | ₦0 | Cancelled | N/A |
| ORD-004 | Today | — | ₦867 | ₦200 | ₦665.72 | Paid | Unpaid |
| ORD-005 | Today | — | ₦0 | ₦0 | ₦0 | Cancelled | N/A |

**Clicking an order opens a detail view with:**
- Full pricing breakdown (subtotal, service fee, delivery fee, FLW fee, VAT, amount settled)
- Rider assigned and payout status
- Flutterwave reference
- Timestamps (created, confirmed, delivered)

---

### Screen 3 — Rider Payouts

**Purpose:** Full visibility into rider payment history and pending payouts.

**Summary cards at top:**
```
Total Paid Out (lifetime)    Pending Tonight    Failed (lifetime)
₦400                         ₦200               ₦0
```

**Payout Batches table:**

| Batch | Date | Riders | Orders | Total Amount | FLW Fees | Status |
|-------|------|--------|--------|-------------|----------|--------|
| BATCH-001 | Yesterday | 2 | 2 | ₦400 | ₦21.50 | Paid |
| BATCH-002 | Tonight | 1 | 1 | ₦200 | TBD | Scheduled |

**Clicking a batch opens:**
- Per rider breakdown within that batch
- Individual transfer references
- Flutterwave transfer IDs
- Order IDs covered

**Per Rider table:**

| Rider | Lifetime Orders | Lifetime Earnings | Last Paid | Pending |
|-------|----------------|-------------------|-----------|---------|
| Rider A | 2 | ₦400 | Yesterday | ₦200 |
| Rider B | 1 | ₦200 | Yesterday | ₦0 |

**Clicking a rider opens:**
- Full payout history for that rider
- Per order earnings
- All batch references

---

### Screen 4 — Transactions

**Purpose:** Raw financial transaction log for reconciliation.

**Filters:** Date range, status, type (customer payment / rider payout)

**Table:**

| Date | Type | Reference | Amount | FLW Fee | VAT | Net | Status |
|------|------|-----------|--------|---------|-----|-----|--------|
| Yesterday | Customer Payment | ORD_001_... | ₦867 | ₦17 | ₦1.28 | ₦865.72 | Successful |
| Yesterday | Customer Payment | ORD_002_... | ₦867 | ₦17 | ₦1.28 | ₦865.72 | Successful |
| Yesterday | Rider Payout | PAY_RiderA_... | ₦200 | ₦10.75 | — | ₦200 | Successful |
| Yesterday | Rider Payout | PAY_RiderB_... | ₦200 | ₦10.75 | — | ₦200 | Successful |
| Today | Customer Payment | ORD_004_... | ₦867 | ₦17 | ₦1.28 | ₦865.72 | Successful |

---

## API Endpoints Summary

Based on the above screens, these are the endpoints needed:

**Dashboard:**
`GET /api/v1/finance/dashboard` — returns all KPI cards and money flow numbers

**Orders:**
`GET /api/v1/finance/orders` — paginated, filterable order list with financial data
`GET /api/v1/finance/orders/:orderId` — single order detail

**Rider Payouts:**
`GET /api/v1/finance/rider-payouts` — payout batches list
`GET /api/v1/finance/rider-payouts/:batchId` — single batch detail
`GET /api/v1/finance/riders` — per rider earnings summary
`GET /api/v1/finance/riders/:riderId` — single rider payout history

**Transactions:**
`GET /api/v1/finance/transactions` — full transaction log, filterable

---

*Vendor settlements, refunds, campus breakdown, and health score are out of scope for this version.*