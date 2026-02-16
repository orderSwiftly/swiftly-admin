import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

export interface DashboardMetrics {
  todaySale: number;
  todaySaleChange: number;
  totalSales: number;
  totalSalesChange: number;
  totalUsers: number;
  totalUsersChange: number;
  totalSchools: number;
  totalSchoolsChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  totalVendors: number;
  totalVendorsChange: number;
  dailyUsers: number;
  dailyUsersChange: number;
  totalRiders: number;
  totalRidersChange: number;
  dailyOrders: number;
  dailyOrdersChange: number;
}

export interface PaymentMethodMetrics {
  transfer: number;
  transferChange: number;
  bank: number;
  bankChange: number;
  cash: number;
  cashChange: number;
}

export interface MonthlyData {
  month: string;
  transfer: number;
  bank: number;
  cash: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      todaySale: 120426,
      todaySaleChange: 36,
      totalSales: 20380485,
      totalSalesChange: 14,
      totalUsers: 33493,
      totalUsersChange: 36,
      totalSchools: 3,
      totalSchoolsChange: 36,
      totalOrders: 84382,
      totalOrdersChange: 36,
      totalVendors: 45,
      totalVendorsChange: -14,
      dailyUsers: 493,
      dailyUsersChange: 36,
      totalRiders: 43,
      totalRidersChange: 36,
      dailyOrders: 33493,
      dailyOrdersChange: 36,
    };
  }
}

export async function getPaymentMethodMetrics(): Promise<PaymentMethodMetrics> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/payment-methods`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment method metrics:", error);
    return {
      transfer: 62,
      transferChange: 10.78,
      bank: 12,
      bankChange: 1.08,
      cash: 30,
      cashChange: 5.9,
    };
  }
}

export async function getMonthlyData(): Promise<MonthlyData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/monthly-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return [
      { month: "Jan", transfer: 90, bank: 20, cash: 40 },
      { month: "Feb", transfer: 120, bank: 30, cash: 40 },
      { month: "Mar", transfer: 130, bank: 25, cash: 35 },
      { month: "Apr", transfer: 100, bank: 20, cash: 30 },
      { month: "May", transfer: 140, bank: 30, cash: 50 },
      { month: "Jun", transfer: 150, bank: 35, cash: 55 },
      { month: "Jul", transfer: 160, bank: 40, cash: 60 },
      { month: "Aug", transfer: 170, bank: 45, cash: 65 },
      { month: "Sep", transfer: 155, bank: 40, cash: 60 },
      { month: "Oct", transfer: 140, bank: 35, cash: 50 },
      { month: "Nov", transfer: 110, bank: 25, cash: 40 },
      { month: "Dec", transfer: 100, bank: 20, cash: 30 },
    ];
  }
}
