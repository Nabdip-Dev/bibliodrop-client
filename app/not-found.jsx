import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-red-50 px-6 py-16">
      <div className="w-full max-w-2xl text-center">

        {/* 404 */}
        <div className="mb-6">
          <h1 className="text-8xl font-black tracking-tight text-red-500 sm:text-9xl">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-12 w-12 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
            />
          </svg>
        </div>

        <h2 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mb-8 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
          The page you are looking for doesn't exist or may have been moved.
          Let's get you back to your local library.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-red-500 px-7 py-3 font-bold text-white shadow-md transition hover:bg-red-600 hover:shadow-lg"
          >
            Go Home
          </Link>

          <Link
            href="/browse-books"
            className="rounded-xl border-2 border-yellow-400 bg-yellow-300 px-7 py-3 font-bold text-gray-900 shadow-md transition hover:bg-yellow-400 hover:shadow-lg"
          >
            Browse Books
          </Link>
        </div>

        <p className="mt-10 text-sm font-medium text-gray-400">
          BiblioDrop — Your Local Library, Delivered
        </p>
      </div>
    </main>
  );
}