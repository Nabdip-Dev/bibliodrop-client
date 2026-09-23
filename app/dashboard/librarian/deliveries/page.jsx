"use client";

const deliveries = [
  {
    id: 1,
    book: "The Great Gatsby",
    customer: "Rahim Ahmed",
    status: "Pending",
  },
  {
    id: 2,
    book: "Clean Code",
    customer: "Karim Hasan",
    status: "Out for Delivery",
  },
];

export default function DeliveriesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">Deliveries</h1>

        <p className="mt-2 text-gray-600">
          Manage book delivery requests.
        </p>

        <div className="mt-8 space-y-5">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <h2 className="text-xl font-bold">
                    {delivery.book}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Customer: {delivery.customer}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                  {delivery.status}
                </span>

              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                <button className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
                  Approve
                </button>

                <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
                  Mark as Delivered
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}