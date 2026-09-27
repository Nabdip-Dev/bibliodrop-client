"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const disabled = loading || googleLoading;

  // =========================================================
  // LOGIN SUCCESS
  // =========================================================

  const showLoginSuccess = () => {
    setError("");
    setShowSuccessModal(true);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1800);
  };

  // =========================================================
  // EMAIL LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
        return;
      }

      showLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        newUserCallbackURL: "/select-role",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Google login failed. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f3ee] text-[#111]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#fc1d15]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-28 h-80 w-80 rounded-full bg-[#fcc615]/20 blur-3xl" />

      <div className="pointer-events-none absolute left-[7%] top-[18%] h-2 w-2 rounded-full bg-[#fc1d15]" />

      <div className="pointer-events-none absolute right-[9%] top-[28%] h-3 w-3 bg-[#fcc615]" />

      <div className="pointer-events-none absolute bottom-[14%] left-[15%] h-1.5 w-1.5 rounded-full bg-black/20" />


      {/* =====================================================
          TOP NAV
      ====================================================== */}

      <nav className="absolute left-0 right-0 top-0 z-20">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">

          {/* Logo */}

          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[3px_3px_0_#111] ring-1 ring-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[4px_5px_0_#111]">

              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                fill="none"
              >

                <path
                  d="M10 9.5C10 7.567 11.567 6 13.5 6H35v31H13.5A3.5 3.5 0 0 0 10 40.5V9.5Z"
                  fill="#fc1d15"
                  stroke="#111"
                  strokeWidth="2.5"
                />

                <path
                  d="M35 6H13.5A3.5 3.5 0 0 0 10 9.5v31A3.5 3.5 0 0 1 13.5 37H35V6Z"
                  fill="white"
                  stroke="#111"
                  strokeWidth="2.5"
                />

                <path
                  d="M17 14h12M17 20h12M17 26h8"
                  stroke="#111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

              </svg>

            </div>

            <div>

              <p className="text-[17px] font-black leading-none">
                Biblio
                <span className="text-[#fc1d15]">
                  Drop
                </span>
              </p>

              <p className="mt-0.5 text-[6px] font-black uppercase tracking-[0.2em] text-black/35">
                Your Local Library
              </p>

            </div>

          </Link>


          {/* Register */}

          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[8px] font-black ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:ring-black/30 hover:shadow-[2px_2px_0_#fcc615]"
          >

            <span className="text-black/40">
              New here?
            </span>

            <span className="text-[#fc1d15]">
              Create account
            </span>

            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
            >

              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

          </Link>

        </div>

      </nav>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-8 pt-24 sm:px-6">

        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_390px] lg:gap-16">


          {/* =================================================
              LEFT INTRO
          ================================================== */}

          <section className="login-intro hidden lg:block">

            {/* Mini badge */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/5">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fc1d15] opacity-30" />

                <span className="relative h-2 w-2 rounded-full bg-[#fc1d15]" />

              </span>

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-black/45">
                Your reading space
              </span>

            </div>


            {/* Heading */}

            <h1 className="max-w-xl text-[62px] font-black leading-[0.88] tracking-[-0.065em]">

              Welcome back
              <br />

              to your{" "}

              <span className="relative inline-block text-[#fc1d15]">

                library.

                <span className="absolute -bottom-1 left-0 h-1 w-2/3 rounded-full bg-[#fcc615]" />

              </span>

            </h1>


            <p className="mt-6 max-w-sm text-sm font-semibold leading-6 text-black/40">

              Pick up where you left off. Discover books,
              manage your collection, and keep your reading
              journey moving.

            </p>


            {/* Book Illustration */}

            <div className="relative mt-9 h-28 w-72">

              {/* Yellow book */}

              <div className="book-one absolute bottom-0 left-3 h-20 w-32 rotate-[-7deg] rounded-lg border-2 border-black bg-[#fcc615] shadow-[5px_5px_0_#111]">

                <div className="absolute left-4 top-4 h-1 w-16 rounded-full bg-black/20" />

                <div className="absolute left-4 top-8 h-1 w-11 rounded-full bg-black/15" />

                <div className="absolute bottom-3 right-3 text-[7px] font-black">
                  READ
                </div>

              </div>


              {/* White book */}

              <div className="book-two absolute bottom-1 left-28 z-10 h-24 w-36 rotate-[4deg] rounded-lg border-2 border-black bg-white shadow-[5px_5px_0_#111]">

                <div className="absolute left-4 top-5 h-1.5 w-20 rounded-full bg-[#fc1d15]" />

                <div className="absolute left-4 top-9 h-1 w-14 rounded-full bg-black/15" />

                <div className="absolute bottom-4 left-4 text-[8px] font-black">
                  BIBLIO
                </div>

              </div>


              {/* Red bookmark */}

              <div className="absolute bottom-7 left-[250px] z-20 h-20 w-5 rotate-[8deg] rounded-b-md bg-[#fc1d15] shadow-[2px_2px_0_#111]">

                <div className="absolute -bottom-1 left-0 border-x-[10px] border-t-[7px] border-x-transparent border-t-[#fc1d15]" />

              </div>

            </div>


            {/* Bottom quote */}

            <div className="mt-2 flex items-center gap-2">

              <div className="h-px w-8 bg-black/15" />

              <span className="text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
                Read · Discover · Repeat
              </span>

            </div>

          </section>


          {/* =================================================
              LOGIN PANEL
          ================================================== */}

          <section className="login-card relative w-full">

            {/* Floating yellow shape */}

            <div className="pointer-events-none absolute -right-3 -top-3 z-0 h-14 w-14 rounded-2xl bg-[#fcc615] rotate-12 transition-transform duration-500" />


            {/* Card */}

            <div className="relative z-10 rounded-[26px] border-2 border-black bg-white p-5 shadow-[7px_8px_0_#111] sm:p-6">


              {/* Top accent */}

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111]">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-[#fcc615]"
                      fill="none"
                    >

                      <path
                        d="M5 19V5h14v14H5Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M8 9h8M8 12h8M8 15h5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>

                  <div>

                    <p className="text-[7px] font-black uppercase tracking-[0.18em] text-black/35">
                      Member access
                    </p>

                    <p className="text-[10px] font-black">
                      BiblioDrop

                    </p>

                  </div>

                </div>


                <div className="h-2 w-2 rounded-full bg-[#fc1d15]" />

              </div>


              {/* Header */}

              <div className="mb-5">

                <h2 className="text-[29px] font-black leading-none tracking-[-0.055em]">

                  Sign in{" "}

                  <span className="text-[#fc1d15]">
                    here.
                  </span>

                </h2>

                <p className="mt-1.5 text-[9px] font-semibold text-black/40">
                  Your books are waiting for you.
                </p>

              </div>


              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="login-shake mb-3 flex items-center gap-2 rounded-xl border border-[#fc1d15]/15 bg-[#fc1d15]/5 px-3 py-2.5">

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fc1d15] text-white">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                    >

                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />

                      <path
                        d="M12 7v5M12 15.5v.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>

                  <p className="text-[8px] font-bold text-[#fc1d15]">
                    {error}
                  </p>

                </div>
              )}


              {/* =================================================
                  GOOGLE
              ================================================== */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={disabled}
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-[#faf9f5] text-[8px] font-black transition-all duration-300 hover:-translate-y-0.5 hover:border-black/30 hover:bg-white hover:shadow-[3px_3px_0_#fcc615] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {googleLoading ? (
                  <>

                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/15 border-t-black" />

                    Connecting...

                  </>
                ) : (
                  <>

                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                    >

                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.78-.07-1.53-.2-2.25H12v4.26h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.4Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.54 13.83a5.86 5.86 0 0 1 0-3.66V7.64H3.3a9.76 9.76 0 0 0 0 8.72l3.24-2.53Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.2 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
                      />

                    </svg>

                    Continue with Google

                  </>
                )}

              </button>


              {/* Divider */}

              <div className="my-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-black/10" />

                <span className="text-[7px] font-black tracking-[0.18em] text-black/25">
                  OR
                </span>

                <div className="h-px flex-1 bg-black/10" />

              </div>


              {/* =================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleLogin}
                className="space-y-3"
              >

                {/* EMAIL */}

                <div className="field-group">

                  <label
                    htmlFor="email"
                    className="mb-1 block text-[7px] font-black uppercase tracking-[0.15em] text-black/45"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/25">

                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                      >

                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="m4 7 8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={disabled}
                      className="h-10 w-full rounded-xl border border-black/10 bg-[#faf9f5] pl-9 pr-3 text-[9px] font-bold outline-none transition-all duration-300 placeholder:text-black/25 focus:border-[#fc1d15] focus:bg-white focus:shadow-[3px_3px_0_#fcc615] disabled:opacity-50"
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <div className="mb-1 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-[7px] font-black uppercase tracking-[0.15em] text-black/45"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[7px] font-bold text-black/30 transition-colors hover:text-[#fc1d15]"
                    >
                      Forgot password?
                    </Link>

                  </div>


                  <div className="relative">

                    {/* Lock */}

                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/25">

                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                      >

                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="M8 10V7a4 4 0 0 1 8 0v3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                      </svg>

                    </div>


                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      disabled={disabled}
                      className="h-10 w-full rounded-xl border border-black/10 bg-[#faf9f5] pl-9 pr-10 text-[9px] font-bold outline-none transition-all duration-300 placeholder:text-black/25 focus:border-[#fc1d15] focus:bg-white focus:shadow-[3px_3px_0_#fcc615] disabled:opacity-50"
                    />


                    {/* Eye */}

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      disabled={disabled}
                      className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/25 transition-all duration-200 hover:bg-[#fff7dc] hover:text-[#fc1d15] active:scale-90"
                    >

                      {showPassword ? (

                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                        >

                          <path
                            d="M3 3l18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.88 5.1A10.8 10.8 0 0 1 12 4.9c5 0 8.5 5.1 8.5 5.1a15.7 15.7 0 0 1-3.07 3.47M6.61 6.62C4.42 8.1 3.5 10 3.5 10s3.5 5.1 8.5 5.1c1.1 0 2.1-.2 3-.56"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                        </svg>

                      ) : (

                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                        >

                          <path
                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />

                        </svg>

                      )}

                    </button>

                  </div>

                </div>


                {/* =================================================
                    LOGIN BUTTON
                ================================================== */}

                <button
                  type="submit"
                  disabled={disabled}
                  className="group relative mt-1 flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#fc1d15] text-[8px] font-black uppercase tracking-[0.16em] text-white shadow-[3px_3px_0_#111] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111] hover:shadow-[4px_5px_0_#fcc615] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {/* Shine */}

                  <span className="absolute inset-y-0 -left-10 w-8 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover:left-[110%]" />

                  {loading ? (
                    <>

                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Logging in...

                    </>
                  ) : (
                    <>

                      Sign In

                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                      >

                        <path
                          d="M5 12h13M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </>
                  )}

                </button>

              </form>


              {/* =================================================
                  BOTTOM
              ================================================== */}

              <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">

                <Link
                  href="/"
                  className="group flex items-center gap-1 text-[7px] font-bold text-black/30 transition-colors hover:text-black"
                >

                  <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                    ←
                  </span>

                  Home

                </Link>


                <p className="text-[7px] font-semibold text-black/35">

                  No account?{" "}

                  <Link
                    href="/register"
                    className="font-black text-[#fc1d15] transition-colors hover:text-black"
                  >
                    Join BiblioDrop
                  </Link>

                </p>

              </div>

            </div>

          </section>

        </div>

      </div>


      {/* =====================================================
          SUCCESS MODAL
      ====================================================== */}

      {showSuccessModal && (
        <div className="login-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-md">

          <div className="login-modal w-full max-w-[340px] rounded-[26px] border-2 border-black bg-white p-7 text-center shadow-[7px_8px_0_#111]">

            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border-2 border-black bg-[#fcc615] shadow-[4px_4px_0_#111]">

              <span className="absolute inset-0 animate-ping rounded-[20px] bg-[#fcc615]/40" />

              <svg
                viewBox="0 0 24 24"
                className="relative z-10 h-8 w-8"
                fill="none"
              >

                <path
                  d="m5 12 4.5 4.5L19 7"
                  stroke="#111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </div>


            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff7dc] px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

              <span className="text-[7px] font-black uppercase tracking-[0.18em] text-black/50">
                You're in
              </span>

            </div>


            <h2 className="text-2xl font-black tracking-[-0.04em]">

              Welcome{" "}

              <span className="text-[#fc1d15]">
                back!
              </span>

            </h2>


            <p className="mx-auto mt-2 max-w-[240px] text-[9px] font-semibold leading-5 text-black/40">

              Everything is ready. Taking you to
              your BiblioDrop dashboard.

            </p>


            <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-black/10">

              <div className="login-progress h-full w-full origin-left rounded-full bg-[#fc1d15]" />

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style jsx>{`

        @keyframes intro {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes card {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bookFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-7deg);
          }

          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
        }

        @keyframes bookFloatTwo {
          0%,
          100% {
            transform: translateY(0) rotate(4deg);
          }

          50% {
            transform: translateY(-6px) rotate(6deg);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-4px);
          }

          75% {
            transform: translateX(4px);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modal {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes progress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        .login-intro {
          animation: intro 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-card {
          animation: card 0.65s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .book-one {
          animation: bookFloat 4s ease-in-out infinite;
        }

        .book-two {
          animation: bookFloatTwo 4.5s 0.2s ease-in-out infinite;
        }

        .login-shake {
          animation: shake 0.35s ease-in-out;
        }

        .login-fade {
          animation: fade 0.25s ease-out both;
        }

        .login-modal {
          animation: modal 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-progress {
          animation: progress 1.65s linear both;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-intro,
          .login-card,
          .book-one,
          .book-two,
          .login-shake,
          .login-fade,
          .login-modal,
          .login-progress {
            animation: none !important;
          }
        }

      `}</style>

    </main>
  );
}
