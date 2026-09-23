"use client";

const librarians = [
  { id: 1, name: "Rahim Ahmed", books: 120, color: "#8B5CF6" },
  { id: 2, name: "Karim Hasan", books: 95, color: "#3B82F6" },
  { id: 3, name: "Nusrat Jahan", books: 82, color: "#10B981" },
  { id: 4, name: "Sadia Rahman", books: 76, color: "#F59E0B" },
  { id: 5, name: "Tanvir Hasan", books: 68, color: "#EC4899" },
  { id: 6, name: "Mim Akter", books: 61, color: "#06B6D4" },
  { id: 7, name: "Arif Hossain", books: 55, color: "#EF4444" },
  { id: 8, name: "Jannat Islam", books: 49, color: "#D97706" },
];

function LibrarianAvatar({ color }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-20 w-20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair */}
      <path
        d="M34 48C31 28 43 16 60 16C78 16 90 29 87 49L81 67H39L34 48Z"
        fill={color}
      />

      {/* Face */}
      <circle cx="60" cy="50" r="25" fill="#FFD9C7" />

      {/* Hair front */}
      <path
        d="M36 43C39 25 49 20 62 20C75 20 84 29 85 42C78 37 73 32 67 31C60 38 49 40 36 43Z"
        fill={color}
      />

      {/* Eyes */}
      <circle cx="51" cy="51" r="2.5" fill="#222" />
      <circle cx="69" cy="51" r="2.5" fill="#222" />

      {/* Smile */}
      <path
        d="M54 61C57 64 63 64 66 61"
        stroke="#222"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M31 110C32 88 42 76 60 76C78 76 88 88 89 110H31Z"
        fill={color}
      />

      {/* Shirt */}
      <path
        d="M49 78L60 92L71 78"
        fill="#fff"
        opacity="0.9"
      />

      {/* Book */}
      <rect
        x="42"
        y="91"
        width="36"
        height="17"
        rx="3"
        fill="#fff"
        transform="rotate(-5 42 91)"
      />

      <path
        d="M60 92V108"
        stroke={color}
        strokeWidth="2"
      />

      {/* Little star */}
      <path
        d="M91 22L93 27L98 29L93 31L91 36L89 31L84 29L89 27L91 22Z"
        fill="#FCC615"
      />
    </svg>
  );
}

function LibrarianCard({ librarian }) {
  return (
    <div className="group w-[250px] shrink-0">
      <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
        {/* Decorative circle */}
        <div
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10"
          style={{ backgroundColor: librarian.color }}
        />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-[20px]"
            style={{
              background: `linear-gradient(135deg, ${librarian.color}18, ${librarian.color}35)`,
            }}
          >
            <LibrarianAvatar color={librarian.color} />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
              Librarian
            </p>

            <h3 className="truncate text-[16px] font-extrabold text-gray-900">
              {librarian.name}
            </h3>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff8df] px-2.5 py-1">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-[#fcc615]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              </svg>

              <span className="text-[11px] font-bold text-gray-700">
                {librarian.books}+ books
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="mt-4 h-1 w-full rounded-full opacity-70 transition-all duration-500 group-hover:w-2/3"
          style={{ backgroundColor: librarian.color }}
        />
      </div>
    </div>
  );
}

export default function TopLibrarians() {
  const firstRow = [...librarians, ...librarians];
  const secondRow = [...librarians.slice(4), ...librarians, ...librarians.slice(0, 4)];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fff6f5] via-[#fffdf8] to-[#fff7dc] py-14">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-20 top-20 h-48 w-48 rounded-full bg-[#fc1d15]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      {/* Cute background SVG */}
      <svg
        className="pointer-events-none absolute left-8 top-10 h-20 w-20 rotate-[-12deg] opacity-[0.08]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M18 34L50 22L82 34V72L50 84L18 72V34Z"
          fill="#fc1d15"
        />
        <path
          d="M50 22V84"
          stroke="#fff"
          strokeWidth="4"
        />
      </svg>

      <svg
        className="pointer-events-none absolute right-10 top-16 h-16 w-16 opacity-[0.12]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 8L56 40L88 50L56 60L50 92L44 60L12 50L44 40L50 8Z"
          fill="#FCC615"
        />
      </svg>

      {/* Header */}
      <div className="relative mx-auto mb-10 max-w-6xl px-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#fcc615]/30 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#fc1d15]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700">
            Trusted Partners
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
          Meet Our{" "}
          <span className="text-[#fc1d15]">Librarians</span>
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
          The people behind our growing library community.
        </p>
      </div>

      {/* Row 1 → */}
      <div className="relative overflow-hidden">
        <div className="librarian-marquee-right flex w-max gap-4 px-4 hover:[animation-play-state:paused]">
          {firstRow.map((librarian, index) => (
            <LibrarianCard
              key={`right-${librarian.id}-${index}`}
              librarian={librarian}
            />
          ))}
        </div>
      </div>

      {/* Row 2 ← */}
      <div className="relative mt-4 overflow-hidden">
        <div className="librarian-marquee-left flex w-max gap-4 px-4 hover:[animation-play-state:paused]">
          {secondRow.map((librarian, index) => (
            <LibrarianCard
              key={`left-${librarian.id}-${index}`}
              librarian={librarian}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="relative mt-8 flex justify-center gap-2">
        <span className="h-1.5 w-8 rounded-full bg-[#fc1d15]" />
        <span className="h-1.5 w-2 rounded-full bg-[#fcc615]" />
        <span className="h-1.5 w-2 rounded-full bg-[#fcc615]" />
      </div>
    </section>
  );
}