import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Book Cover */}
      <div className="relative flex h-52 items-center justify-center bg-gray-100">
        <span className="text-6xl">
          📚
        </span>

        {!book.available && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Unavailable
          </span>
        )}
      </div>

      {/* Book Information */}
      <div className="p-5">

        <p className="text-sm text-blue-600">
          {book.category}
        </p>

        <h2 className="mt-1 text-lg font-bold">
          {book.title}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          {book.author}
        </p>

        <p className="mt-3 font-semibold">
          Delivery Fee: ৳{book.fee}
        </p>

        <Link
          href={`/books/${book.id}`}
          className="mt-4 block rounded-lg bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}