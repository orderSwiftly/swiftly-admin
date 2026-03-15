import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatMoney {
  amount: number;
  change: string;
  direction: "up" | "down";
}

export interface StatCount {
  count: number;
  change: string;
  direction: "up" | "down";
}

export interface DashboardStats {
  todaysSale:   StatMoney;
  totalSales:   StatMoney;
  totalUsers:   StatCount;
  totalSchools: StatCount;
  totalOrders:  StatCount;
  totalVendors: StatCount;
  dailyUsers:   StatCount;
  totalRiders:  StatCount;
  dailyOrders:  StatCount;
}

interface DashboardStatsResponse {
  status: string;
  data: DashboardStats;
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

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await axios.get<DashboardStatsResponse>(
      `${apiUrl}/api/v1/dashboard/stats`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return res.data.data;
  } catch (err) {
    handleAxiosError(err, "Failed to fetch dashboard stats");
  }
}