import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage the BiblioDrop platform.
        </p>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Total Users</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Total Books</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Pending Approvals</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Transactions</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

        </div>

        {/* Admin Options */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <Link
            href="/dashboard/admin/approval"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              ✅ Approval Queue
            </h2>

            <p className="mt-2 text-gray-600">
              Review and approve pending requests.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              👥 Manage Users
            </h2>

            <p className="mt-2 text-gray-600">
              View and manage platform users.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/books"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              📚 All Books
            </h2>

            <p className="mt-2 text-gray-600">
              View all books on the platform.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              💳 Transactions
            </h2>

            <p className="mt-2 text-gray-600">
              View payment and transaction records.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}