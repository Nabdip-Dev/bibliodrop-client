"use client";

const transactions = [
  {
    id: "TXN-001",
    user: "Rahim Ahmed",
    book: "The Great Gatsby",
    amount: 50,
    status: "Paid",
  },
  {
    id: "TXN-002",
    user: "Karim Hasan",
    book: "Clean Code",
    amount: 70,
    status: "Paid",
  },
];

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-2 text-gray-600">
          View payment and transaction records.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[700px]">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Transaction ID
                </th>

                <th className="px-6 py-4 text-left">
                  User
                </th>

                <th className="px-6 py-4 text-left">
                  Book
                </th>

                <th className="px-6 py-4 text-left">
                  Amount
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {transaction.id}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.user}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {transaction.book}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ${transaction.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}