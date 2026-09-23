import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-2 text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mb-8 text-gray-600">
          Choose your dashboard
        </p>

        <div className="grid gap-6 md:grid-cols-2">

          {/* User */}
          <Link
            href="/dashboard/user"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              User Dashboard
            </h2>

            <p className="mt-2 text-gray-600">
              View deliveries, reading list and reviews.
            </p>
          </Link>

          {/* Librarian */}
          <Link
            href="/dashboard/librarian"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              Librarian Dashboard
            </h2>

            <p className="mt-2 text-gray-600">
              Manage books, inventory and deliveries.
            </p>
          </Link>

          {/* Admin */}
          <Link
            href="/dashboard/admin"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              Admin Dashboard
            </h2>

            <p className="mt-2 text-gray-600">
              Manage users, books, approvals and transactions.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}