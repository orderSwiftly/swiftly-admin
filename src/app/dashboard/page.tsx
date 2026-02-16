"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
// import { PaymentMethodCard } from "@/components/dashboard/payment-method-card";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import {
  getDashboardMetrics,
  getPaymentMethodMetrics,
  getMonthlyData,
  DashboardMetrics,
  PaymentMethodMetrics,
  MonthlyData,
} from "@/lib/api/get-dashboard-metrics";

export default function DashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethodMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsData, paymentData, monthlyChartData] = await Promise.all([
          getDashboardMetrics(),
          getPaymentMethodMetrics(),
          getMonthlyData(),
        ]);
        setMetrics(metricsData);
        setPaymentMethods(paymentData);
        setMonthlyData(monthlyChartData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || !metrics || !paymentMethods) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <MonthlyChart data={monthlyData} paymentMethods={paymentMethods} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="TODAY'S SALE"
            value={metrics.todaySale}
            change={metrics.todaySaleChange}
            prefix="₦"
          />
          <MetricCard
            title="TOTAL SALES"
            value={metrics.totalSales}
            change={metrics.totalSalesChange}
            prefix="₦"
          />
          <MetricCard
            title="TOTAL USERS"
            value={metrics.totalUsers}
            change={metrics.totalUsersChange}
          />

          <MetricCard
            title="TOTAL SCHOOLS"
            value={metrics.totalSchools}
            change={metrics.totalSchoolsChange}
          />
          <MetricCard
            title="TOTAL ORDERS"
            value={metrics.totalOrders}
            change={metrics.totalOrdersChange}
          />
          <MetricCard
            title="TOTAL VENDORS"
            value={metrics.totalVendors}
            change={metrics.totalVendorsChange}
          />

          <MetricCard
            title="DAILY USERS"
            value={metrics.dailyUsers}
            change={metrics.dailyUsersChange}
          />
          <MetricCard
            title="TOTAL RIDERS"
            value={metrics.totalRiders}
            change={metrics.totalRidersChange}
          />
          <MetricCard
            title="DAILY ORDERS"
            value={metrics.dailyOrders}
            change={metrics.dailyOrdersChange}
          />
        </div>
      </div>
    </div>
  );
}
