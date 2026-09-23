import Link from "next/link";

export default function Banner() {
  return (
    <section className="bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
          BiblioDrop
        </p>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Your Local Library,
          <span className="block text-blue-600">
            Delivered
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Discover books from local libraries and independent
          book owners and get them delivered to your doorstep.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/browse-books"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Browse Books
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Get Started
          </Link>

        </div>

      </div>
    </section>
  );
}