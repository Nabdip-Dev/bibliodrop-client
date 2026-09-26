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
  const [showToast, setShowToast] = useState(false);

  // =========================
  // Login Success
  // =========================
  const showLoginSuccess = () => {
    setError("");
    setShowToast(true);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1800);
  };

  // =========================
  // Email Login
  // =========================
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

  // =========================
  // Google Login
  // =========================
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
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf9] via-white to-[#fff7dc] px-4 py-6 sm:px-6">

      {/* Background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#fcc615]/[0.12] blur-3xl" />

      {/* =====================================================
          SUCCESS TOAST
      ===================================================== */}
      {showToast && (
        <div className="login-toast-in fixed right-4 top-4 z-[100] sm:right-6 sm:top-6">
          <div className="flex min-w-[280px] items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 shadow-[5px_5px_0_#111]">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fcc615]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-black"
                fill="none"
              >
                <path
                  d="m6 12 4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-black text-black">
                Login successful
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-black/45">
                Welcome back to BiblioDrop!
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}
      {showSuccessModal && (
        <div className="login-fade-in fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="login-modal-in w-full max-w-sm rounded-[24px] border-2 border-black bg-white p-7 text-center shadow-[7px_8px_0_#111]">

            {/* Success Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-[#fcc615] shadow-[3px_3px_0_#111]">

              <svg
                viewBox="0 0 24 24"
                className="login-check-pop h-8 w-8"
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

            {/* Badge */}
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff7dc] px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

              <span className="text-[9px] font-black uppercase tracking-wider text-black/55">
                You're in
              </span>

            </div>

            <h2 className="text-2xl font-black tracking-tight text-black">
              Welcome{" "}
              <span className="text-[#fc1d15]">
                back!
              </span>
            </h2>

            <p className="mt-2 text-sm font-medium leading-5 text-black/45">
              Login successful. Taking you to your dashboard...
            </p>

            {/* Progress */}
            <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-black/10">
              <div className="login-progress h-full w-full origin-left rounded-full bg-[#fc1d15]" />
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md flex-col justify-center">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <div className="mb-7 flex justify-center">

          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_#111] transition-transform duration-200 group-hover:-translate-y-0.5">

              <svg
                viewBox="0 0 48 48"
                className="h-6 w-6"
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
              <div className="text-[21px] font-black leading-none tracking-tight text-black">
                Biblio<span className="text-[#fc1d15]">Drop</span>
              </div>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-black/40">
                Your Local Library
              </p>
            </div>

          </Link>

        </div>

        {/* =====================================================
            LOGIN CARD
        ===================================================== */}
        <section className="overflow-hidden rounded-[22px] border-2 border-black bg-white shadow-[6px_7px_0_#111]">

          {/* Yellow Accent */}
          <div className="h-1.5 w-full bg-[#fcc615]" />

          <div className="p-6 sm:p-8">

            {/* Header */}
            <div className="mb-7">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff7dc] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

                <span className="text-[9px] font-black uppercase tracking-wider text-black/55">
                  Member Login
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-[-0.04em] text-black">
                Welcome{" "}
                <span className="text-[#fc1d15]">
                  back.
                </span>
              </h1>

              <p className="mt-2 text-sm font-medium text-black/45">
                Sign in to continue your reading journey.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}
            {error && (
              <div className="login-shake mb-5 flex items-center gap-3 rounded-xl border-2 border-[#fc1d15]/20 bg-[#fc1d15]/[0.05] px-3.5 py-3">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fc1d15] text-white">

                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M12 7v6M12 16.5v.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>

                </div>

                <p className="text-xs font-bold text-[#fc1d15]">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-black/10 bg-white px-4 text-sm font-bold text-black transition-all duration-200 hover:border-black hover:bg-[#fffdf8] hover:shadow-[3px_3px_0_#fcc615] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {googleLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                  <span>
                    Connecting...
                  </span>
                </>
              ) : (
                <>
                  {/* Google Logo */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
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

                  <span>
                    Continue with Google
                  </span>
                </>
              )}

            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-black/10" />

              <span className="text-[9px] font-black tracking-widest text-black/25">
                OR
              </span>

              <div className="h-px flex-1 bg-black/10" />

            </div>

            {/* =================================================
                FORM
            ================================================= */}
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-black/55"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading || googleLoading}
                  className="h-12 w-full rounded-xl border-2 border-black/10 bg-[#fffdf8] px-3.5 text-sm font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[3px_3px_0_#fcc615] disabled:bg-gray-100"
                />

              </div>

              {/* Password */}
              <div>

                <div className="mb-1.5 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-[10px] font-black uppercase tracking-wider text-black/55"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-black/35 transition-colors hover:text-[#fc1d15]"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* Password Input */}
                <div className="relative">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading || googleLoading}
                    className="h-12 w-full rounded-xl border-2 border-black/10 bg-[#fffdf8] px-3.5 pr-12 text-sm font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[3px_3px_0_#fcc615] disabled:bg-gray-100"
                  />

                  {/* Eye Button */}
                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="password-eye group absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-black/35 hover:bg-[#fff7dc] hover:text-black active:scale-90"
                  >

                    {showPassword ? (
                      /* Eye Off */
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
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
                      /* Eye */
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#fc1d15] px-4 text-sm font-black text-white shadow-[3px_3px_0_#111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e91912] hover:shadow-[4px_4px_0_#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    <span>
                      Logging in...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Login
                    </span>

                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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

            {/* Register */}
            <p className="mt-6 text-center text-xs font-medium text-black/40">

              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-black text-[#fc1d15] transition-colors hover:text-black"
              >
                Create one
              </Link>

            </p>

          </div>
        </section>

        {/* Back Home */}
        <div className="mt-5 text-center">

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-black/35 transition-colors hover:text-black"
          >
            <span>←</span>
            Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}
