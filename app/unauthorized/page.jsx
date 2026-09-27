import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5">

      {/* Soft background */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md animate-[fadeIn_.5s_ease-out] rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-transform duration-300 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect
              x="4"
              y="10"
              width="16"
              height="11"
              rx="2"
            />
            <path
              strokeLinecap="round"
              d="M8 10V7a4 4 0 018 0v3"
            />
            <path
              strokeLinecap="round"
              d="M12 14v3"
            />
          </svg>
        </div>

        {/* 403 */}
        <div className="mt-6 text-6xl font-bold tracking-tight text-slate-900">
          403
        </div>

        <h1 className="mt-3 text-xl font-semibold text-slate-800">
          Access denied
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          You don't have permission to access this page.
          Please contact your administrator if you need access.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Go Home
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>

        {/* Error code */}
        <p className="mt-7 text-[11px] font-medium tracking-wider text-slate-400">
          ERROR · 403 FORBIDDEN
        </p>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
