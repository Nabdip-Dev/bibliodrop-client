"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4", "#EF4444", "#D97706"];

/* =========================================================
   AVATAR
========================================================= */

function LibrarianAvatar({ color }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-24 w-24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34 48C31 28 43 16 60 16C78 16 90 29 87 49L81 67H39L34 48Z"
        fill={color}
      />

      <circle cx="60" cy="50" r="25" fill="#FFD9C7" />

      <path
        d="M36 43C39 25 49 20 62 20C75 20 84 29 85 42C78 37 73 32 67 31C60 38 49 40 36 43Z"
        fill={color}
      />

      <circle cx="51" cy="51" r="2.5" fill="#222" />
      <circle cx="69" cy="51" r="2.5" fill="#222" />

      <path
        d="M54 61C57 64 63 64 66 61"
        stroke="#222"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M31 110C32 88 42 76 60 76C78 76 88 88 89 110H31Z"
        fill={color}
      />

      <path
        d="M49 78L60 92L71 78"
        fill="#fff"
        opacity="0.9"
      />

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

      <path
        d="M91 22L93 27L98 29L93 31L91 36L89 31L84 29L89 27L91 22Z"
        fill="#FCC615"
      />
    </svg>
  );
}

/* =========================================================
   BOOK ICON
========================================================= */

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    </svg>
  );
}

/* =========================================================
   BACKGROUND BOOK
========================================================= */

function BackgroundBook() {
  return (
    <svg
      className="
        pointer-events-none
        absolute
        left-[-25px]
        top-10
        h-28
        w-28
        rotate-[-12deg]
        opacity-[0.06]
      "
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M18 34L50 22L82 34V72L50 84L18 72V34Z"
        fill="#FC1D15"
      />

      <path
        d="M50 22V84"
        stroke="#fff"
        strokeWidth="4"
      />
    </svg>
  );
}

/* =========================================================
   BACKGROUND STAR
========================================================= */

function BackgroundStar() {
  return (
    <svg
      className="
        pointer-events-none
        absolute
        right-5
        top-5
        h-20
        w-20
        opacity-[0.1]
      "
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M50 8L56 40L88 50L56 60L50 92L44 60L12 50L44 40L50 8Z"
        fill="#FCC615"
      />
    </svg>
  );
}

/* =========================================================
   GET OFFSET
========================================================= */

function getOffset(index, activeIndex, total) {
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

/* =========================================================
   LIBRARIAN CARD
========================================================= */

function LibrarianCard({
  librarian,
  offset,
}) {
  const isCenter = offset === 0;
  const isLeft = offset === -1;
  const isRight = offset === 1;
  const isFarLeft = offset === -2;
  const isFarRight = offset === 2;

  let positionClass = "";

  if (isCenter) {
    positionClass = `
      left-1/2
      top-1/2
      z-30
      -translate-x-1/2
      -translate-y-1/2
      scale-100
      rotate-0
      opacity-100
    `;
  } else if (isLeft) {
    positionClass = `
      left-1/2
      top-1/2
      z-20
      -translate-y-1/2
      -translate-x-[112%]
      scale-[0.78]
      -rotate-[8deg]
      opacity-75
    `;
  } else if (isRight) {
    positionClass = `
      left-1/2
      top-1/2
      z-20
      -translate-y-1/2
      translate-x-[12%]
      scale-[0.78]
      rotate-[8deg]
      opacity-75
    `;
  } else if (isFarLeft) {
    positionClass = `
      left-1/2
      top-1/2
      z-10
      -translate-y-1/2
      -translate-x-[190%]
      scale-[0.55]
      -rotate-[12deg]
      opacity-0
      pointer-events-none
    `;
  } else if (isFarRight) {
    positionClass = `
      left-1/2
      top-1/2
      z-10
      -translate-y-1/2
      translate-x-[90%]
      scale-[0.55]
      rotate-[12deg]
      opacity-0
      pointer-events-none
    `;
  } else {
    positionClass = `
      left-1/2
      top-1/2
      z-0
      -translate-y-1/2
      -translate-x-1/2
      scale-[0.4]
      opacity-0
      pointer-events-none
    `;
  }

  return (
    <div
      className={`
        absolute
        w-[270px]
        sm:w-[300px]
        origin-center
        transform-gpu
        transition-all
        duration-[800ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        will-change-transform,opacity
        ${positionClass}
      `}
    >
      <div
        className={`
    relative
    overflow-hidden
    rounded-[30px]
    border
    border-[#fc1d15]/80
    bg-gradient-to-br from-red-200 via-white to-[#f5ef90]
    p-5
    sm:p-6
    shadow-[0_25px_70px_rgba(0,0,0,0.10)]
    backdrop-blur-xl
    transition-all
    duration-500
    ${isCenter
            ? "shadow-[0_30px_80px_rgba(252,29,21,0.18)]"
            : ""
          }
  `}
      >

        {/* Decoration */}
        <div
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.09]"
          style={{
            backgroundColor: librarian.color,
          }}
        />

        <div className="absolute right-5 top-5">
          <div className="h-2 w-2 rounded-full bg-[#FCC615]" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
          <div
            className="relative flex h-[125px] w-[125px] items-center justify-center rounded-[32px]"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  ${librarian.color}15,
                  ${librarian.color}35
                )
              `,
            }}
          >
            {librarian.image ? (
              <img
                src={librarian.image}
                alt={librarian.name}
                className="h-full w-full rounded-[32px] object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback = event.currentTarget.parentElement?.querySelector("[data-avatar-fallback]");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
            ) : null}

            <div data-avatar-fallback className={librarian.image ? "hidden" : ""}>
              <LibrarianAvatar color={librarian.color} />
            </div>

            <div className="absolute right-2 top-2 text-[#FCC615]">
              ✦
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="relative mt-5 text-center">
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.25em]
              text-[#FC1D15]
            "
          >
            Librarian
          </p>

          <h3 className="mt-2 truncate text-xl font-black tracking-tight text-gray-900">
            {librarian.name}
          </h3>

          <p className="mt-1 truncate text-xs text-gray-400">
            {librarian.email}
          </p>

          {/* Books */}
          <div className="mt-4 flex justify-center">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#FFF8DF]
                px-4
                py-2
                text-[#4B4B4B]
              "
            >
              <span className="text-[#FCC615]">
                <BookIcon />
              </span>

              <span className="text-xs font-extrabold">
                {librarian.books}+ Books
              </span>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="mx-auto mt-5 h-1.5 w-20 rounded-full"
          style={{
            backgroundColor: librarian.color,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TopLibrarians() {
  const [librarians, setLibrarians] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadLibrarians = async () => {
      try {
        setError("");
        const [usersResponse, booksResponse] = await Promise.all([
          fetch(`${API_URL}/librarians`, { cache: "no-store" }),
          fetch(`${API_URL}/books`, { cache: "no-store" }),
        ]);

        if (!usersResponse.ok || !booksResponse.ok) {
          throw new Error("Failed to load librarian data");
        }

        const usersData = await usersResponse.json();
        const booksData = await booksResponse.json();
        const users = Array.isArray(usersData) ? usersData : (Array.isArray(usersData?.users) ? usersData.users : []);
        const books = Array.isArray(booksData) ? booksData : (Array.isArray(booksData?.books) ? booksData.books : []);

        const realLibrarians = users
          .filter((user) => String(user?.role || "").toLowerCase() === "librarian")
          .map((user, index) => {
            const userId = String(user?.id || user?._id || "");
            const bookCount = books.filter((book) => {
              const librarianId = book?.librarianId || book?.librarianID || book?.ownerId || book?.userId;
              return librarianId && String(librarianId) === userId;
            }).length;

            return {
              id: userId || `librarian-${index}`,
              name: user?.name || user?.fullName || user?.email?.split("@")[0] || "Librarian",
              email: user?.email || "",
              image: user?.image || user?.imageUrl || user?.photoURL || user?.avatar || user?.profileImage || "",
              books: bookCount,
              color: COLORS[index % COLORS.length],
            };
          });

        if (mounted) {
          setLibrarians(realLibrarians);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("TopLibrarians:", err);
        if (mounted) {
          setError("Unable to load librarians right now.");
          setLibrarians([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadLibrarians();
    const refreshTimer = setInterval(loadLibrarians, 30000);
    return () => {
      mounted = false;
      clearInterval(refreshTimer);
    };
  }, []);

  const total = librarians.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const totalBooks = librarians.reduce((sum, librarian) => sum + Number(librarian.books || 0), 0);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#d8ffb3] via-[#FFFDF9] to-[#FFF7DE] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#FC1D15]/[0.045] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FCC615]/[0.09] blur-3xl" />
        <BackgroundBook />
        <BackgroundStar />
        <div className="absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-[#FC1D15]/20" />
        <div className="absolute right-[14%] top-[42%] h-3 w-3 rounded-full bg-[#FCC615]/30" />
        <div className="absolute bottom-[20%] left-[20%] h-2 w-2 rounded-full bg-[#FCC615]/30" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-4 xl:gap-10">
        <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FCC615]/30 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FC1D15]" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-600 sm:text-xs">Trusted Partners</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Meet Our <span className="relative text-[#FC1D15]">Librarians<span className="absolute -bottom-1 left-0 h-1 w-14 rounded-full bg-[#FCC615]" /></span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base lg:mx-0">
            The people behind our growing library community. Our librarians help readers discover wonderful books, explore new ideas, and make every reading experience more enjoyable.
          </p>

          <div className="mx-auto mt-7 grid max-w-lg grid-cols-3 gap-2 sm:gap-3 lg:mx-0">

            <div className="rounded-2xl border border-white/20 text-center p-2 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1">
              <p className="text-xl font-black text-gray-900 sm:text-2xl">{loading ? "..." : `${total}+`}</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-gray-400 sm:text-[9px]">Librarians</p>
            </div>

            <div className="rounded-2xl border border-white/20 text-center p-2 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1">
              <p className="text-xl font-black text-gray-900 sm:text-2xl">{loading ? "..." : `${totalBooks}+`}</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-gray-400 sm:text-[9px]">Books</p>
            </div>

            <div className="rounded-2xl border border-white/20 text-center p-2 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1">
              <p className="text-xl font-black text-gray-900 sm:text-2xl">24/7</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-gray-400 sm:text-[9px]">Support</p>
            </div>

          </div>

          <div className="mx-auto mt-6 flex max-w-lg items-center gap-3 rounded-2xl border border-white bg-white/65 px-4 py-4 text-left shadow-sm backdrop-blur lg:mx-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8DF] text-lg text-[#FCC615]">✦</div>
            <div>
              <p className="text-xs font-bold text-gray-700 sm:text-sm">A team that loves books</p>
              <p className="mt-1 text-[10px] leading-4 text-gray-400">Helping readers find their next great story.</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex -space-x-2">
              {librarians.slice(0, 5).map((person) => (
                <div key={person.id} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm">
                  {person.image ? <img src={person.image} alt={person.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: person.color }}>{person.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div>}
                </div>
              ))}
            </div>
            <div className="text-left"><p className="text-xs font-bold text-gray-700">Our Library Team</p><p className="text-[9px] text-gray-400">Working together for readers</p></div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-20 h-[420px] w-full max-w-[1000px] lg:mt-10">

          <div className="absolute left-1/2 top-[-35px] -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.25em] text-blue-600/60">
            Our Community
          </div>

          {loading ?
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
              Loading librarians...
            </div> : error ?
              <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-sm font-bold text-red-400">{error}</div> : librarians.length === 0 ? <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-sm font-bold text-gray-400">No librarians found.</div> : librarians.map((librarian, index) => <LibrarianCard key={librarian.id} librarian={librarian} offset={getOffset(index, activeIndex, total)} />)}
        </div>
      </div>
    </section>
  );
}

