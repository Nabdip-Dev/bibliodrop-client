"use client";

const requests = [
  {
    id: 1,
    book: "The Great Gatsby",
    librarian: "Rahim Ahmed",
    status: "Pending",
  },
  {
    id: 2,
    book: "Clean Code",
    librarian: "Karim Hasan",
    status: "Pending",
  },
];

export default function ApprovalPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Approval Queue
        </h1>

        <p className="mt-2 text-gray-600">
          Review pending requests.
        </p>

        <div className="mt-8 space-y-5">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <h2 className="text-xl font-bold">
                    {request.book}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Librarian: {request.librarian}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                  {request.status}
                </span>

              </div>

              <div className="mt-5 flex gap-3">
                <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Approve
                </button>

                <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}