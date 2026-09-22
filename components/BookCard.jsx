import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-xl">

      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {!book.available && (
          <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            Unavailable
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">

        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {book.category}
        </p>

        <h2 className="mt-1 line-clamp-1 text-lg font-bold">
          {book.title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {book.author}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Delivery Fee
            </p>

            <p className="font-bold">
              ₹{book.fee}
            </p>
          </div>

          <Link
            href={`/books/${book.id}`}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
}