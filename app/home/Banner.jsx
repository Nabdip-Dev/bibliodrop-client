import Link from "next/link";

const backgroundBooks = [
  {
    src: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=85",
    className: "book-image book-image-1",
  },
  {
    src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
    className: "book-image book-image-2",
  },
  {
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
    className: "book-image book-image-3",
  },
  {
    src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=85",
    className: "book-image book-image-4",
  },
];

export default function Banner() {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-[#f6e99d82] px-5 py-10 sm:px-8 lg:min-h-[680px] lg:py-12">

      {/* BACKGROUND IMAGE SLIDES */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {backgroundBooks.map((book) => (
          <div
            key={book.src}
            className={`${book.className} absolute overflow-hidden rounded-3xl`}
          >
            <img
              src={book.src}
              alt=""
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0" />
          </div>
        ))}

        {/* soft background glow */}

        <div className="absolute -left-40 top-10 h-[360px] w-[360px] rounded-full bg-[#fcc615]/15 blur-[90px]" />

        <div className="absolute -right-40 bottom-5 h-[360px] w-[360px] rounded-full bg-[#fc1d15]/10 blur-[90px]" />

        {/* white premium overlay */}

        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/80 via-[#faf9f6]/90 to-[#faf9f6]" />
      </div>

      {/* MAIN */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* TOP LABEL */}

        <div className="animate-fade-down flex items-center justify-center gap-3">

          <span className="h-px w-7 bg-[#fc1d15]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#fc1d15]">
            BiblioDrop
          </span>

          <span className="h-px w-7 bg-[#fcc615]" />

        </div>

        {/* HERO CONTENT */}

        <div className="mx-auto mt-6 max-w-5xl text-center">

          {/* badge */}

          <div className="animate-fade-up">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3.5 py-1.5 shadow-sm backdrop-blur-md">

              <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#fc1d15]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-700">
                Books from your community
              </span>

            </div>

          </div>

          {/* heading */}

          <h1 className="animate-fade-up-delay-1 text-4xl font-black leading-[0.95] tracking-[-0.045em] text-black sm:text-5xl md:text-6xl lg:text-[68px]">

            Your Local Library,

            <span className="relative mt-2 block">

              <span className="relative z-10 text-[#fc1d15]">
                Delivered
              </span>

              {/* yellow accent */}

              <span className="absolute -bottom-1 left-1/2 h-2.5 w-40 -translate-x-1/2 -rotate-1 rounded-full bg-[#fcc615]/70 sm:w-52" />

            </span>

          </h1>

          {/* description */}

          <p className="animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">

            Discover remarkable books from local libraries and independent
            book owners — and have your next great read delivered right to
            your doorstep.

          </p>

          {/* BUTTONS */}

          <div className="animate-fade-up-delay-3 mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/browse-books"
              className="group relative inline-flex min-w-[165px] items-center justify-center overflow-hidden rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#fc1d15]/20"
            >

              <span className="absolute inset-0 -translate-x-full bg-[#fc1d15] transition-transform duration-500 group-hover:translate-x-0" />

              <span className="relative flex items-center gap-2">

                Browse Books

                <svg
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>

              </span>

            </Link>

            <Link
              href="/register"
              className="group inline-flex min-w-[165px] items-center justify-center rounded-xl border border-black/10 bg-white/80 px-6 py-3.5 text-sm font-bold text-gray-900 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#fcc615] hover:bg-[#fcc615] hover:shadow-xl hover:shadow-[#fcc615]/20"
            >

              Get Started

              <span className="ml-2 transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

        </div>

        {/* PREMIUM BOOK CARD */}

        <div className="animate-fade-up-delay-4 mx-auto mt-10 max-w-3xl">

          <div className="group relative overflow-hidden rounded-[22px] border border-black/10 bg-white/80 p-2.5 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-700 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#fc1d15]/10">

            <div className="relative overflow-hidden rounded-[17px] bg-gradient-to-r from-[#111] via-[#252525] to-[#111] px-5 py-5 sm:px-8">

              {/* yellow line */}

              <div className="absolute left-0 top-0 h-full w-1 bg-[#fcc615]" />

              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

                <div className="text-center sm:text-left">

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#fcc615]">
                    Read. Discover. Repeat.
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                    Great stories are closer than you think.
                  </h2>

                </div>

                <div className="flex items-center gap-2">

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/80">
                    Local
                  </span>

                  <span className="rounded-full bg-[#fc1d15] px-3 py-1.5 text-[10px] font-semibold text-white">
                    Delivered
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SCROLL INDICATOR */}

        <div className="mt-6 flex flex-col items-center gap-1.5 text-gray-400">

          <span className="text-[9px] font-semibold uppercase tracking-[0.28em]">
            Scroll to explore
          </span>

          <div className="flex h-8 w-5 justify-center rounded-full border border-black/15 p-1">

            <div className="h-1.5 w-1 animate-scroll rounded-full bg-[#fc1d15]" />

          </div>

        </div>

      </div>

    </section>
  );
}