import Link from "next/link";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
  },
  {
    id: 5,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
  },
  {
    id: 6,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
  },
];

export default function LatestBooks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold">
            Latest Books
          </h2>

          <p className="mt-2 text-gray-600">
            Explore recently added books.
          </p>
        </div>

        <Link
          href="/browse-books"
          className="font-semibold text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-5xl">📚</span>
            </div>

            <p className="mt-4 text-sm text-blue-600">
              {book.category}
            </p>

            <h3 className="mt-1 text-xl font-bold">
              {book.title}
            </h3>

            <p className="mt-1 text-gray-600">
              {book.author}
            </p>

            <Link
              href={`/books/${book.id}`}
              className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}