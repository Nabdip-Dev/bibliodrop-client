"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Email + Password Login
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

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#fffdf8] to-[#fff7dc] px-4 py-7">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#fc1d15]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-5 h-64 w-64 rounded-full bg-[#fcc615]/[0.12] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <Link href="/" className="group flex items-center gap-2.5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_#111] transition-all group-hover:-translate-y-0.5">
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

            <div className="leading-none">
              <div className="text-[20px] font-black text-black">
                Biblio<span className="text-[#fc1d15]">Drop</span>
              </div>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-black/45">
                Your Local Library
              </p>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[24px] border-2 border-black bg-white shadow-[7px_8px_0_#111] lg:grid-cols-[0.72fr_1.28fr]">

          {/* ================= LEFT SIDE ================= */}
          <div className="relative hidden bg-[#fcc615] p-7 lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border-[20px] border-white/25" />

            <div className="relative z-10">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0_#111]">
                <span className="h-2 w-2 rounded-full bg-[#fc1d15]" />

                <span className="text-[9px] font-black uppercase tracking-wider">
                  Welcome Back
                </span>
              </div>

              <h2 className="max-w-xs text-4xl font-black leading-[0.95] tracking-tight text-black">
                Welcome
                <span className="block text-[#fc1d15]">
                  back.
                </span>
                Keep reading.
              </h2>

              <p className="mt-4 max-w-xs text-xs font-semibold leading-5 text-black/65">
                Sign in to access your BiblioDrop account,
                discover books and continue your reading
                journey.
              </p>
            </div>

            {/* Book Illustration */}
            <div className="relative mt-5 flex h-32 items-center justify-center">

              <div className="absolute bottom-1 h-5 w-32 rounded-full bg-black/15 blur-md" />

              {/* Red Book */}
              <div className="absolute left-12 top-5 h-20 w-28 -rotate-12 rounded-lg border-2 border-black bg-[#fc1d15] shadow-[3px_3px_0_#111]" />

              {/* White Book */}
              <div className="absolute right-9 top-2 h-24 w-32 rotate-6 rounded-lg border-2 border-black bg-white shadow-[3px_3px_0_#111]">

                <div className="absolute left-4 top-4 h-2 w-16 rounded-full bg-[#fcc615]" />

                <div className="absolute left-4 top-9 h-1.5 w-20 rounded-full bg-black/10" />

                <div className="absolute left-4 top-14 h-1.5 w-12 rounded-full bg-black/10" />

                <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-md bg-[#fc1d15]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                  >
                    <path
                      d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-[9px] font-bold text-black/40">
              Your library is waiting for you.
            </p>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="p-5 sm:p-7">

            {/* Heading */}
            <div className="mb-5">

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#fff7dc] px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

                <span className="text-[9px] font-black uppercase tracking-wider text-black/55">
                  Member Login
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
                Welcome{" "}
                <span className="text-[#fc1d15]">
                  Back
                </span>
              </h1>

              <p className="mt-1 text-xs font-medium text-black/45">
                Login to your BiblioDrop account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-[#fc1d15]">
                {error}
              </div>
            )}

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0_#111] transition-all hover:-translate-y-0.5 hover:bg-[#fffaf0] hover:shadow-[4px_4px_0_#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#111] disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#fff3d0] text-xs font-black">
                    G
                  </span>

                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />

              <span className="text-[9px] font-black text-black/30">
                OR
              </span>

              <div className="h-px flex-1 bg-black/10" />
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-3"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-black/55"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-2 border-black/15 bg-[#fffdf8] px-3 py-2.5 text-xs font-semibold outline-none transition focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-black/55"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border-2 border-black/15 bg-[#fffdf8] px-3 py-2.5 text-xs font-semibold outline-none transition focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-[#fc1d15] px-4 py-3 text-xs font-black text-white shadow-[3px_3px_0_#111] transition-all hover:-translate-y-0.5 hover:bg-[#e91912] hover:shadow-[4px_4px_0_#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#111] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login

                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
            <p className="mt-4 text-center text-xs font-medium text-black/45">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-black text-[#fc1d15] hover:text-black"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Back Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[10px] font-bold text-black/40 transition hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}