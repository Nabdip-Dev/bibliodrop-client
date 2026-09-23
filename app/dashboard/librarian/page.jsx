import Link from "next/link";

export default function LibrarianDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Librarian Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your books and deliveries.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            + Add Book
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Total Books</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Available</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Deliveries</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <Link
            href="/dashboard/librarian/add-book"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">📚 Add Book</h2>
            <p className="mt-2 text-gray-600">
              Add a new book to your library inventory.
            </p>
          </Link>

          <Link
            href="/dashboard/librarian/books"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">📖 Manage Books</h2>
            <p className="mt-2 text-gray-600">
              View and manage your existing books.
            </p>
          </Link>

          <Link
            href="/dashboard/librarian/deliveries"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">🚚 Manage Deliveries</h2>

            <p className="mt-2 text-gray-600">
              View and update delivery requests.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}