export interface Order {
  id: string;
  orderId: string;
  status: "Completed" | "Cancelled" | "Refunded" | "In Transit";
  email: string;
  university: string;
  name: string;
  number: string;
  vendor: string;
  vendorEmail: string;
  vendorNumber: string;
  state: string;
  rider: string;
  riderNumber: string;
  items: number;
  totalAmount: number;
  refundIssuer?: string;
  issuerLevel?: string;
}

export type OrderStatus =
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "In Transit"
  | "All Status";
