import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Fiction",
    description: "Stories & novels",
    color: "text-violet-600",
    bg: "bg-[#F3EEFF]",
    iconBg: "bg-[#E7DCFF]",
    glow: "bg-violet-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    color: "text-blue-600",
    bg: "bg-[#EAF3FF]",
    iconBg: "bg-[#D9EAFF]",
    glow: "bg-blue-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    color: "text-emerald-600",
    bg: "bg-[#E9FBF3]",
    iconBg: "bg-[#D5F5E7]",
    glow: "bg-emerald-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    color: "text-orange-600",
    bg: "bg-[#FFF3E8]",
    iconBg: "bg-[#FFE4CF]",
    glow: "bg-orange-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    color: "text-cyan-600",
    bg: "bg-[#E8FAFD]",
    iconBg: "bg-[#D3F3F8]",
    glow: "bg-cyan-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    color: "text-amber-600",
    bg: "bg-[#FFF8E6]",
    iconBg: "bg-[#FFF0C2]",
    glow: "bg-amber-300/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-6 w-6"
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
    <section className="bg-[#faf9f6] px-4 py-12 sm:px-6 sm:py-16">

      {/* Main Red Container */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#fc1d15] px-5 py-8 shadow-[0_20px_50px_rgba(252,29,21,0.18)] sm:px-8 sm:py-10 lg:px-10">

        {/* Decorative Glow - Top Left */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#fcc615]/30 blur-[85px]" />

        {/* Decorative Glow - Top Right */}
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-white/15 blur-[80px]" />

        {/* Decorative Glow - Bottom */}
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#fcc615]/20 blur-[100px]" />

        {/* Content */}
        <div className="relative">

          {/* ================= HEADER ================= */}
          <div className="mx-auto max-w-2xl text-center">

            {/* Label */}
            <div className="mb-3 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-white/60" />

              <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#ffe45c] backdrop-blur-sm">
                Explore Collection
              </span>

              <span className="h-px w-8 bg-white/60" />

            </div>

            {/* Heading */}
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Browse by{" "}
              <span className="text-[#fcc615]">
                Category
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
              Explore our collection and discover books that match your
              interests, curiosity, and passion.
            </p>

          </div>

          {/* ================= CATEGORY CARDS ================= */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse-books?category=${encodeURIComponent(
                  category.name
                )}`}
                className={`
                  group relative overflow-hidden
                  rounded-[20px]
                  ${category.bg}
                  px-3 py-4
                  text-center
                  shadow-[0_6px_0_rgba(0,0,0,0.08),0_12px_22px_rgba(0,0,0,0.12)]
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_9px_0_rgba(0,0,0,0.07),0_20px_30px_rgba(0,0,0,0.17)]
                `}
              >

                {/* Card Shine */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-black/[0.03]" />

                {/* Card Glow */}
                <div
                  className={`
                    pointer-events-none absolute
                    -right-7 -top-7
                    h-20 w-20
                    rounded-full
                    ${category.glow}
                    blur-2xl
                    transition-transform duration-700
                    group-hover:scale-150
                  `}
                />

                {/* Small top highlight */}
                <div className="absolute left-1/2 top-0 h-1 w-0 -translate-x-1/2 rounded-full bg-[#fc1d15] transition-all duration-500 group-hover:w-12" />

                {/* Icon */}
                <div
                  className={`
                    relative mx-auto flex h-11 w-11
                    items-center justify-center
                    rounded-[15px]
                    ${category.iconBg}
                    ${category.color}
                    shadow-[0_5px_12px_rgba(0,0,0,0.08)]
                    transition-all duration-500
                    group-hover:-translate-y-1
                    group-hover:rotate-3
                    group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]
                  `}
                >
                  {category.icon}
                </div>

                {/* Category Name */}
                <h3 className="relative mt-3 text-[12px] font-extrabold tracking-tight text-gray-900 sm:text-[13px]">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="relative mt-1 text-[9px] font-medium leading-4 text-gray-500">
                  {category.description}
                </p>

                {/* Arrow */}
                <div
                  className="
                    relative mx-auto mt-3
                    flex h-6 w-6
                    items-center justify-center
                    rounded-full
                    bg-white/80
                    text-gray-400
                    shadow-sm
                    transition-all duration-500
                    group-hover:bg-[#fc1d15]
                    group-hover:text-white
                    group-hover:shadow-md
                  "
                >
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
