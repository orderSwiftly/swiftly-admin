import GetBalance from "./get-balance";
import GetTransactions from "./get-transactions";

export default function TransactionPage() {
  return (
    <main className="min-h-screen bg-[var(--light-bg)] pt-4 md:pt-6 md:pl-72 lg:pl-20 xl:pl-72 px-4 md:px-6 pb-20 md:pb-6 overflow-x-hidden">
      <div className="max-w-5xl space-y-6">
        {/* Balance Component */}
        <GetBalance />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold pry-ff text-[var(--acc-clr)]">
            Transactions
          </h1>
        </div>

        {/* Transactions Table */}
        <GetTransactions />
      </div>
    </main>
  );
}