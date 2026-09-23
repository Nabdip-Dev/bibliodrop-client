"use client";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    librarian: "Rahim Ahmed",
    status: "Available",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    librarian: "Karim Hasan",
    status: "Checked Out",
  },
];

export default function AllBooksPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          All Books
        </h1>

        <p className="mt-2 text-gray-600">
          View all books available on BiblioDrop.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[700px]">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Book
                </th>

                <th className="px-6 py-4 text-left">
                  Author
                </th>

                <th className="px-6 py-4 text-left">
                  Librarian
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-semibold">
                    {book.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {book.author}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {book.librarian}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        book.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                      Remove
                    </button>
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