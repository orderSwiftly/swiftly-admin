import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "collected"
  | "delivered"
  | "cancelled"
  | "refunded"
  | string;

export type PaymentStatus = "paid" | "unpaid" | "refunded" | string;
export type EscrowStatus = "held" | "released" | "refunded" | string;

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  lineTotal: number;
  productOwnerId: string;
  productImg: string[];
  itemStatus?: string;
  shippedAt?: string;
}

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export interface ShippingAddress {
  // new address format
  building?: string;
  room?: string;
  institutionId?: string;
  // legacy address format
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ApiOrder {
  _id: string;
  userId: string;
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: ShippingAddress;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  escrowStatus: EscrowStatus;
  paystackReference: string;
  deliveryCode: number;
  confirmed: boolean;
  seller_name?: string;
  assigned_rider_id?: string;
  createdAt: string;
  paymentConfirmedAt?: string;
  shippedAt?: string;
  claimed_at?: string;
  collected_at?: string;
  delivered_at?: string;
}

interface GetAllOrdersResponse {
  status: string;
  results: number;
  data: {
    orders: ApiOrder[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthToken(): string {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be logged in to access this page");
  return token;
}

function handleAxiosError(err: unknown, fallback: string): never {
  if (err instanceof AxiosError) {
    throw new Error(err.response?.data?.message || err.message || fallback);
  }
  throw err;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getAllOrders(): Promise<ApiOrder[]> {
  try {
    const res = await axios.get<GetAllOrdersResponse>(
      `${apiUrl}/api/v1/super-admin/get-all-orders`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return res.data.data.orders;
  } catch (err) {
    handleAxiosError(err, "Failed to fetch orders");
  }
}