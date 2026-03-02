export interface Vendor {
  id: string;
  name: string;
  status: "Enabled" | "Disabled";
  school: string;
  location: string;
  email?: string;
  phone?: string;
  type?: string;
}

export type VendorStatus = "Enabled" | "Disabled";

export interface PendingVendor {
  id: string;
  name: string;
  university: string;
  type: string;
  email: string;
  phone: string;
}

export interface VendorMetrics {
  todaySale: number;
  todaySaleChange: number;
  totalSales: number;
  totalSalesChange: number;
  dailyOrders: number;
  dailyOrdersChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  monthlyData: {
    month: string;
    completed: number;
    cancelled: number;
  }[];
}
