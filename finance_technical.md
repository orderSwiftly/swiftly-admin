# Swiftly Finance API — Technical Specification
*For the frontend engineering team. To be read alongside the Finance Dashboard UI Proposal document.*

---

## General Notes

**Base URL:** `https://api.orderswiftly.com/api/v1/super-admin/finance`

**Authentication:** All endpoints require a valid admin or superadmin JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Any request without a valid admin token returns:
```json
{ "status": "error", "message": "Unauthorized", "statusCode": 403 }
```

**Date format:** All dates passed as query parameters should be in `YYYY-MM-DD` format. Example: `2026-05-19`. All dates returned in responses are ISO 8601 strings.

**Pagination:** All list endpoints are paginated. Default page size is 20. Pass `page` and `limit` to control. When a single item is returned via `?id=`, pagination is `null`.

**All responses follow this envelope:**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

## Endpoint 1 — Finance Dashboard

```
GET /api/v1/finance/dashboard
```

This is the main dashboard endpoint. It powers the entire Screen 1 from the UI proposal — the executive snapshot, money flow section, rider liability card, and failed transactions card.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | date | No | 7 days ago | Start of date range for money flow and totals |
| `to` | date | No | today | End of date range for money flow and totals |

**Important:** The `from` and `to` range only affects the money flow section and total figures. The KPI cards (GPV, Swiftly Net Revenue, Failed Transactions) always compare yesterday against the day before yesterday — regardless of the range selected. This is intentional.

### Example Request
```
GET /api/v1/finance/dashboard?from=2026-05-01&to=2026-05-19
```

### Response
```json
{
  "status": "success",
  "data": {
    "range": {
      "from": "2026-05-01T00:00:00.000Z",
      "to": "2026-05-19T23:59:59.999Z"
    },
    "gpv": {
      "yesterday": 1734,
      "day_before": 867,
      "change_pct": 100,
      "order_count": 2
    },
    "swiftly_net_revenue": {
      "yesterday": 909.94,
      "day_before": 454.97,
      "change_pct": 100
    },
    "rider_liability": {
      "unpaid": { "count": 1, "total": 200 },
      "processing": { "count": 0, "total": 0 }
    },
    "failed_transactions": {
      "yesterday": { "count": 1, "total": 850 },
      "day_before": { "count": 0, "total": 0 },
      "change_count": null
    },
    "money_flow": {
      "customers_paid": 2601,
      "vendor_allocation": 600,
      "rider_allocation": 400,
      "swiftly_gross": 1997.16
    }
  }
}
```

### Mapping to UI

**`gpv`** → powers the Gross Platform Volume KPI card. Show `yesterday` as the primary number, `change_pct` as the percentage badge. `order_count` is the number of paid orders yesterday.

**`swiftly_net_revenue`** → powers the Swiftly Net Revenue KPI card. Show `yesterday` as the primary number, `change_pct` as the percentage badge. This is already net of rider payouts — do not subtract anything further.

**`rider_liability`** → powers the Rider Liability KPI card. Show `unpaid.total` as the primary number with `unpaid.count` orders. Show `processing.total` separately as "currently processing" — these are orders in an active payout batch that hasn't been confirmed yet.

**`failed_transactions`** → powers the Failed Transactions KPI card. Show `yesterday.count` and `yesterday.total`. `change_count` is the % change in count — can be `null` if there were zero failures the day before (avoid dividing by zero).

**`money_flow`** → powers the Money Flow visual in Section 2 of the UI. Each field maps directly to one block in the flow:
- `customers_paid` → Customers Paid block
- `vendor_allocation` → Vendor Allocation block
- `rider_allocation` → Rider Allocation block (only confirmed paid payouts)
- `swiftly_gross` → Swiftly Revenue block (gross, before rider payout deduction)

All money flow figures are for the selected date range.

---

## Endpoint 2 — Orders

```
GET /api/v1/finance/orders
```

Powers Screen 2 (Orders) from the UI proposal. Returns a paginated list of orders with their financial breakdown. Passing `?id=` returns a single order in full detail for the drill-down view.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | date | No | — | Filter orders created on or after this date |
| `to` | date | No | — | Filter orders created on or before this date |
| `paymentStatus` | string | No | — | Filter by payment status. Values: `paid`, `cancelled`, `pending` |
| `payoutStatus` | string | No | — | Filter by rider payout status. Values: `unpaid`, `processing`, `paid` |
| `id` | string | No | — | MongoDB ObjectId of a specific order. Returns single order, no pagination |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |

### Example Requests
```
GET /api/v1/finance/orders?from=2026-05-01&to=2026-05-19&paymentStatus=paid
GET /api/v1/finance/orders?id=6642b1f0e13c4a001f3d9e22
```

### Response (list)
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "_id": "6642b1f0e13c4a001f3d9e22",
        "store_name": "Mama Put Express",
        "createdAt": "2026-05-18T10:24:00.000Z",
        "paymentStatus": "paid",
        "payout_status": "paid",
        "flutterwaveReference": "ORD_1716025440000",
        "paymentConfirmedAt": "2026-05-18T10:25:12.000Z",
        "delivered_at": "2026-05-18T11:10:00.000Z",
        "assigned_rider_id": "663fa1c2e13c4a001f3d8b11",
        "pricing": {
          "subtotal": 200,
          "serviceFee": 50,
          "deliveryFee": 600,
          "total": 850
        },
        "payment": {
          "charged_amount": 867,
          "flw_fee": 17,
          "vat": 1.28,
          "amount_settled": 865.72,
          "swiftly_earnings": 665.72,
          "flw_id": 2040448264
        }
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

### Response (single, when `?id=` is passed)
```json
{
  "status": "success",
  "data": {
    "orders": { ... single order object ... },
    "pagination": null
  }
}
```

### Mapping to UI

**List view** → the orders table in Screen 2. Each row maps to one order object. Columns:
- Order → `_id`
- Date → `createdAt`
- Store → `store_name`
- Amount Charged → `payment.charged_amount`
- Vendor Cut → `pricing.subtotal`
- Swiftly Gross → `payment.swiftly_earnings`
- Payment Status → `paymentStatus`
- Payout Status → `payout_status`

**Detail view (clicking an order)** → use `?id=` to fetch the full order. Show the complete pricing breakdown, all payment fields, rider info via `assigned_rider_id`, and all timestamps.

---


## Endpoint 3 — Rider Payouts

```
GET /api/v1/finance/rider-payouts
```

Powers the Rider Payouts section in Screen 3. One document = one rider's payout for one nightly batch. Filters can be stacked.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | date | No | — | Filter by `created_at` on or after this date |
| `to` | date | No | — | Filter by `created_at` on or before this date |
| `status` | string | No | — | Filter by payout status. Values: `processing`, `paid`, `failed` |
| `batch_id` | number | No | — | Filter by Flutterwave batch ID — returns all riders paid in that nightly run |
| `rider_id` | string | No | — | MongoDB ObjectId of a rider — returns all payouts for that specific rider |
| `id` | string | No | — | MongoDB ObjectId of a specific payout document. Returns single item, no pagination |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |

### Example Requests
```
GET /api/v1/finance/rider-payouts
GET /api/v1/finance/rider-payouts?batch_id=33286
GET /api/v1/finance/rider-payouts?rider_id=663fa1c2e13c4a001f3d8b11
GET /api/v1/finance/rider-payouts?id=6642b1f0e13c4a001f3d9f33
```

### Response (list)
```json
{
  "status": "success",
  "data": {
    "payouts": [
      {
        "_id": "6642b1f0e13c4a001f3d9f33",
        "batch_id": 33286,
        "rider_id": "663fa1c2e13c4a001f3d8b11",
        "order_ids": [
          "6642b1f0e13c4a001f3d9e22",
          "6642b1f0e13c4a001f3d9e23"
        ],
        "amount": 400,
        "reference": "PAY_663fa1c2e13c4a001f3d8b11_20260518",
        "status": "paid",
        "flw_transfer_id": 33286,
        "fee": 10.75,
        "paid_at": "2026-05-18T22:00:00.000Z",
        "created_at": "2026-05-18T22:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### Mapping to UI

**Payout Batches table** → filter by `batch_id` to get all riders in a nightly run. Each row = one rider's payout that night.

**Per Rider table** → filter by `rider_id` to get a rider's full payout history. Sum `amount` for lifetime earnings.

**Single payout detail** → use `?id=` to get one payout document. `order_ids` array tells you exactly which orders were covered in this payout — use those IDs against the orders endpoint if you need the order details.

**Pending tonight** → filter by `status=processing` to show payouts in the current nightly batch that haven't been confirmed yet.

**Failed transfers** → filter by `status=failed` to power the Failed Transfers section in Screen 3.

---

## Endpoint 4 — Customer Payment Transactions

```
GET /api/v1/finance/transactions/payments
```

Raw customer payment log. Powers the Transactions screen (Screen 4) for the customer payments side.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | date | No | — | Filter by `createdAt` on or after this date |
| `to` | date | No | — | Filter by `createdAt` on or before this date |
| `status` | string | No | — | Filter by payment status. Values: `paid`, `cancelled`, `pending` |
| `id` | string | No | — | MongoDB ObjectId of a specific order. Returns single item, no pagination |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |

### Example Requests
```
GET /api/v1/finance/transactions/payments?from=2026-05-01&to=2026-05-19
GET /api/v1/finance/transactions/payments?status=paid
GET /api/v1/finance/transactions/payments?id=6642b1f0e13c4a001f3d9e22
```

### Response
```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "_id": "6642b1f0e13c4a001f3d9e22",
        "store_name": "Mama Put Express",
        "createdAt": "2026-05-18T10:24:00.000Z",
        "paymentStatus": "paid",
        "flutterwaveReference": "ORD_1716025440000",
        "paymentConfirmedAt": "2026-05-18T10:25:12.000Z",
        "pricing": { "total": 850 },
        "payment": {
          "charged_amount": 867,
          "flw_fee": 17,
          "vat": 1.28,
          "amount_settled": 865.72,
          "swiftly_earnings": 665.72,
          "flw_id": 2040448264
        }
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

### Mapping to UI

Each row in the transactions table maps to one payment object:
- Date → `createdAt`
- Type → hardcode `"Customer Payment"` on the frontend
- Reference → `flutterwaveReference`
- Amount → `payment.charged_amount`
- FLW Fee → `payment.flw_fee`
- VAT → `payment.vat`
- Net → `payment.amount_settled`
- Status → `paymentStatus`

---

## Endpoint 5 — Rider Transfer Transactions

```
GET /api/v1/finance/transactions/transfers
```

Raw rider payout transfer log. Powers the Transactions screen (Screen 4) for the rider transfers side.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | date | No | — | Filter by `created_at` on or after this date |
| `to` | date | No | — | Filter by `created_at` on or before this date |
| `status` | string | No | — | Filter by transfer status. Values: `processing`, `paid`, `failed` |
| `batch_id` | number | No | — | Filter by Flutterwave batch ID |
| `rider_id` | string | No | — | MongoDB ObjectId of a rider |
| `id` | string | No | — | MongoDB ObjectId of a specific transfer. Returns single item, no pagination |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |

### Example Requests
```
GET /api/v1/finance/transactions/transfers?from=2026-05-01&to=2026-05-19
GET /api/v1/finance/transactions/transfers?status=failed
GET /api/v1/finance/transactions/transfers?id=6642b1f0e13c4a001f3d9f33
```

### Response
```json
{
  "status": "success",
  "data": {
    "transfers": [
      {
        "_id": "6642b1f0e13c4a001f3d9f33",
        "batch_id": 33286,
        "rider_id": "663fa1c2e13c4a001f3d8b11",
        "order_ids": ["6642b1f0e13c4a001f3d9e22"],
        "amount": 200,
        "reference": "PAY_663fa1c2e13c4a001f3d8b11_20260518",
        "status": "paid",
        "flw_transfer_id": 33286,
        "fee": 10.75,
        "paid_at": "2026-05-18T22:00:00.000Z",
        "failed_at": null,
        "failure_reason": null,
        "created_at": "2026-05-18T22:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### Mapping to UI

Each row in the transfers table maps to one transfer object:
- Date → `created_at`
- Type → hardcode `"Rider Payout"` on the frontend
- Reference → `reference`
- Amount → `amount`
- FLW Fee → `fee`
- VAT → not stored separately, frontend can derive as `fee / 1.075 * 0.075` if needed
- Net → `amount` (rider receives full amount, fee is deducted from Swiftly's balance)
- Status → `status`
- Failure Reason → `failure_reason` (only present on failed transfers)

---

## Summary Table

| Endpoint | Method | Powers |
|----------|--------|--------|
| `/finance/dashboard` | GET | Screen 1 — Executive snapshot, money flow, liabilities |
| `/finance/orders` | GET | Screen 2 — Orders list and order detail |
| `/finance/rider-payouts` | GET | Screen 3 — Rider payout batches, per-rider history |
| `/finance/transactions/payments` | GET | Screen 4 — Customer payment log |
| `/finance/transactions/transfers` | GET | Screen 4 — Rider transfer log |

---

*Vendor settlements, refunds, campus breakdown, alerts panel, and health score are out of scope for this version.*