import Link from "next/link";

const deliveries = [
  {
    id: 1,
    book: "The Great Gatsby",
    status: "Delivered",
  },
  {
    id: 2,
    book: "Clean Code",
    status: "Pending",
  },
];

export default function UserDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              User Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your books and deliveries.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            Browse Books
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Total Deliveries</p>
            <h2 className="mt-2 text-3xl font-bold">2</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="mt-2 text-3xl font-bold">1</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Reading List</p>
            <h2 className="mt-2 text-3xl font-bold">3</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">Reviews</p>
            <h2 className="mt-2 text-3xl font-bold">1</h2>
          </div>

        </div>

        {/* Delivery History */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">
            Delivery History
          </h2>

          <div className="mt-5 space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {delivery.book}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Delivery #{delivery.id}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {delivery.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              📚 Reading List
            </h2>

            <p className="mt-2 text-gray-600">
              View books you want to read.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              ⭐ My Reviews
            </h2>

            <p className="mt-2 text-gray-600">
              View your submitted book reviews.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              🔍 Browse Books
            </h2>

            <p className="mt-2 text-gray-600">
              Find your next book.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}