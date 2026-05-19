import GrossProfitVol from "./gross-profit-vol";
import OrdersTable from "./order-table";
import RiderLiability from "./rider-liability";
import FailedTransactions from "./failed-transactions";

export default function Section1() {
    return (
        <section className="w-full flex flex-col gap-6">
            {/* ── KPI cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                    <GrossProfitVol />
                </div>
                <div className="sm:col-span-2">
                    <RiderLiability />
                </div>
            </div>

            {/* ── Failed transactions ───────────────────────────────────── */}
            <FailedTransactions />

            {/* ── Orders table ──────────────────────────────────────────── */}
            <OrdersTable />

        </section>
    );
}