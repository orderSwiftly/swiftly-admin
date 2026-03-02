export interface FinancialTransaction {
  id: string;
  name: string;
  amount: number;
  school: string;
  location: string;
  status: "Processed" | "Pending";
}

export interface FinancialMetrics {
  totalRevenue: number;
  commission: number;
  vendorPayouts: number;
  commissionRate: number;
}
