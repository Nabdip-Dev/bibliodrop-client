import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Fiction",
    description: "Stories & novels",
    iconColor: "text-[#8B5CF6]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
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
    ),
  },

  {
    id: 2,
    name: "Technology",
    description: "Code & innovation",
    iconColor: "text-[#3B82F6]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9 9 2 2-2 2M13 13h2"
        />
      </svg>
    ),
  },

  {
    id: 3,
    name: "Self Help",
    description: "Growth & mindset",
    iconColor: "text-[#10B981]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21c0-5 1-8 5-11"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21c0-5-1-8-5-11"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 13c-2-4-5-5-8-4 1 4 3 6 8 6"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10c2-4 5-5 8-4-1 4-3 6-8 6"
        />
      </svg>
    ),
  },

  {
    id: 4,
    name: "History",
    description: "Past & civilization",
    iconColor: "text-[#C08457]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 21h18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 21V9l7-4 7 4v12"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 21v-8h8v8M3 9h18"
        />
      </svg>
    ),
  },

  {
    id: 5,
    name: "Science",
    description: "Discovery & research",
    iconColor: "text-[#06B6D4]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3h6M10 3v6.5L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-8.5V3"
        />
        <path strokeLinecap="round" d="M7 16h10" />
        <circle cx="10" cy="14" r=".7" fill="currentColor" />
        <circle cx="14" cy="17" r=".7" fill="currentColor" />
      </svg>
    ),
  },

  {
    id: 6,
    name: "Finance",
    description: "Money & business",
    iconColor: "text-[#D4A017]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path strokeLinecap="round" d="M7 6V4h10v2" />
        <circle cx="12" cy="13" r="3" />
        <path
          strokeLinecap="round"
          d="M12 11.5v3M13 12.2c-.3-.4-.7-.6-1.2-.6-.7 0-1.2.4-1.2 1s.5.9 1.4 1.1c.8.2 1.2.5 1.1 1s-.5 1-1.3 1c-.6 0-1.1-.2-1.4-.7"
        />
      </svg>
    ),
  },
];

export default function Categories() {
  return (
    <section className="relative overflow-hidden bg-[#faf9f6] px-5 py-12 sm:px-8 sm:py-14">

      <div className=" bg-[#fc1d15f9] rounded-4xl mx-auto items-center p-8">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#fcc615]/10 blur-[90px]" />

        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#fc1d15]/10 blur-[90px]" />

        <div className="relative mx-auto max-w-6xl">

          {/* Section Header */}

          <div className="mx-auto max-w-2xl text-center">

            {/* small label */}

            <div className="mb-3 flex items-center justify-center gap-3">

              <span className="h-px w-7 bg-[#fc1d15]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#fcc615]">
                Explore Collection
              </span>

              <span className="h-px w-7 bg-white" />

            </div>

            <h2 className="text-3xl font-black tracking-[-0.035em] text-black sm:text-4xl">
              Browse by{" "}
              <span className="text-[#d4f900]">
                Category
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-300 sm:text-base">
              Explore our collection and discover books that match your
              interests, curiosity, and passion.
            </p>

          </div>

          {/* Categories */}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse-books?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-4 text-center shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#fc1d15]/25 hover:shadow-lg hover:shadow-[#fc1d15]/10"
              >
                {/* soft hover background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fc1d15]/[0.04] via-transparent to-[#fcc615]/[0.08] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* top colorful accent */}
                <div className="absolute left-1/2 top-0 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#fc1d15] to-[#fcc615] transition-all duration-500 group-hover:w-16" />

                {/* Icon */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#faf9f6] shadow-sm transition-all duration-500 ${category.iconColor} group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md`}
                >
                  {category.icon}
                </div>

                {/* Category name */}
                <h3 className="mt-3 text-sm font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#fc1d15]">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="mt-1 text-[10px] font-medium leading-4 text-gray-400">
                  {category.description}
                </p>

                {/* Small arrow */}
                <div className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all duration-500 group-hover:bg-[#fcc615] group-hover:text-black">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M4 10h11M11 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}