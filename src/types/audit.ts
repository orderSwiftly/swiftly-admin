export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  email: string;
  role: string;
  isFlagged?: boolean;
  flagText?: string;
  userType?: string;
  name?: string;
  phone?: string;
  phoneCode?: string;
  university?: string;
  actionDetail?: string;
}

export type AuditAction =
  | "Vendor Suspended"
  | "Order Refunded"
  | "Comm rate change"
  | "Rider Suspended"
  | "3 suspicious login attempts";
