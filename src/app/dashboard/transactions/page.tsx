import GetBalance from "./get-balance";
import GetTransactions from "./get-transactions";

export default function TransactionPage() {
  return (
    <main className="min-h-screen bg-[var(--light-bg)] px-4 py-10 flex flex-col items-start gap-8">
      {/* Balance should appear at the top */}
      <GetBalance />

      <h1 className="text-4xl font-bold pry-ff text-[var(--acc-clr)]">Transactions</h1>

      <GetTransactions />

      {/* Additional transaction content can go here later */}
    </main>
  );
}
