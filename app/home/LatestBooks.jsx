import Link from "next/link";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    color: "text-[#8B5CF6]",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    color: "text-[#3B82F6]",
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    color: "text-[#10B981]",
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    color: "text-[#8B5CF6]",
  },
  {
    id: 5,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    color: "text-[#C08457]",
  },
  {
    id: 6,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    color: "text-[#D4A017]",
  },
];

export default function LatestBooks() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#faf9f6] to-[#fff8df]">
      {/* Cute background decorations */}
      <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[#fc1d15]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fc1d15]/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">

        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-[#fc1d15]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                New Collection
              </span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Latest <span className="text-[#fc1d15]">Books</span>
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore recently added books.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fc1d15]/30 hover:text-[#fc1d15] hover:shadow-md sm:self-auto"
          >
            View All
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M4 10h11M11 6l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Books Grid */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#fc1d15]/20 hover:shadow-xl hover:shadow-[#fc1d15]/[0.07]"
            >
              {/* Soft Hover Background */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fc1d15]/[0.025] via-transparent to-[#fcc615]/[0.07] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Top Accent */}
              <div className="absolute left-1/2 top-0 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#fc1d15] to-[#fcc615] transition-all duration-500 group-hover:w-20" />

              {/* Book Cover */}
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-[#faf9f6]">
                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#fcc615]/10 transition-transform duration-700 group-hover:scale-150" />
                <div className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-[#fc1d15]/5 transition-transform duration-700 group-hover:scale-125" />

                {/* Book Icon */}
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 ${book.color}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-9 w-9"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.5 2H20v19H6.5A2.5 2.5 0 0 1 4 18.5v-14A2.5 2.5 0 0 1 6.5 2Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 6h8M8 10h6"
                    />
                  </svg>
                </div>

                {/* Category Badge */}
                <span
                  className={`absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur ${book.color}`}
                >
                  {book.category}
                </span>
              </div>

              {/* Book Info */}
              <div className="pt-4">
                <h3 className="line-clamp-1 text-base font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#fc1d15]">
                  {book.title}
                </h3>

                <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                  {book.author}
                </p>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Available
                  </span>

                  <Link
                    href={`/books/${book.id}`}
                    className="group/button inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3.5 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-[#fc1d15]"
                  >
                    Details
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5"
                    >
                      <path
                        d="M4 10h11M11 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>

  );
}