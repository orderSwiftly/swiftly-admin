export interface Rider {
  id: string;
  name: string;
  status: "Enabled" | "Disabled";
  school: string;
  location: string;
  email?: string;
  phone?: string;
}

export type RiderStatus = "Enabled" | "Disabled";

export interface PendingRider {
  id: string;
  name: string;
  university: string;
  email: string;
  phone: string;
}

export interface RiderMetrics {
  active: number;
  activeChange: number;
  averageTime: string;
  averageTimeChange: number;
  todaysOrder: number;
  todaysOrderChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  monthlyData: {
    month: string;
    completed: number;
  }[];
}
