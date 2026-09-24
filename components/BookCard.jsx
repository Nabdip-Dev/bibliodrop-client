import Link from "next/link";

export default function BookCard({ book }) {
  const isAvailable = book.status === "available";

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Book Cover */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            📚
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute right-3 top-3">
          {isAvailable ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Available
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Book Information */}
      <div className="p-5">
        {/* Category */}
        {book.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {book.category}
          </p>
        )}

        {/* Title */}
        <h2 className="mt-2 line-clamp-1 text-lg font-bold text-gray-900">
          {book.title}
        </h2>

        {/* Author */}
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
          by {book.author}
        </p>

        {/* Description */}
        {book.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
            {book.description}
          </p>
        )}

        {/* Bottom Section */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-gray-500">
              Delivery Fee
            </p>

            <p className="text-lg font-bold text-gray-900">
              ₹{book.deliveryFee}
            </p>
          </div>

          <Link
            href={`/books/${book._id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}