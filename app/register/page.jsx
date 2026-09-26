"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!["user", "librarian"].includes(role)) {
      setError("Please select a valid account type.");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: CREATE ACCOUNT
      const { error: signUpError } =
        await authClient.signUp.email({
          name,
          email,
          password,
          image: image || undefined,
          callbackURL: "/login",
        });

      if (signUpError) {
        setError(
          signUpError.message || "Registration failed."
        );
        return;
      }

      // STEP 2: SAVE ROLE
      const roleResponse = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      });

      const roleData = await roleResponse.json();

      if (!roleResponse.ok) {
        setError(
          roleData.message ||
            "Failed to save account role."
        );
        return;
      }

      // STEP 3: LOGOUT
      await authClient.signOut();

      // STEP 4: LOGIN
      router.replace("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE REGISTER =================
  const handleGoogleRegister = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      /*
       * Google OAuth flow is the same as the Login page.
       *
       * New Google users:
       * Google -> /select-role
       *
       * Existing Google users:
       * Google -> /dashboard
       */
      await authClient.signIn.social({
        provider: "google",
        newUserCallbackURL: "/select-role",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("GOOGLE REGISTER ERROR:", err);

      setError(
        err?.message ||
          "Google authentication failed."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#fffdf8] to-[#fff7dc] px-4 py-4 sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-[#fc1d15]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-60 w-60 rounded-full bg-[#fcc615]/[0.12] blur-3xl" />

      {/* Main Wrapper */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-xl flex-col justify-center">

        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white shadow-[3px_3px_0_#111] transition-all group-hover:-translate-y-0.5">
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

            <div className="leading-none">
              <div className="text-[19px] font-black tracking-tight text-black">
                Biblio
                <span className="text-[#fc1d15]">
                  Drop
                </span>
              </div>

              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.18em] text-black/40">
                Your Local Library
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <section className="overflow-hidden rounded-[20px] border-2 border-black bg-white shadow-[6px_7px_0_#111]">
          <div className="h-1.5 w-full bg-[#fcc615]" />

          <div className="p-5 sm:p-6">

            {/* Header */}
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#fff7dc] px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

                  <span className="text-[8px] font-black uppercase tracking-wider text-black/55">
                    Create Account
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-[-0.04em] text-black sm:text-[27px]">
                  Join{" "}
                  <span className="text-[#fc1d15]">
                    BiblioDrop
                  </span>
                </h1>

                <p className="mt-0.5 text-[11px] font-medium text-black/40">
                  Create your account and start reading.
                </p>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#fcc615] shadow-[2px_2px_0_#111] sm:flex">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                >
                  <path
                    d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z"
                    stroke="#111"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M5 5.5v15"
                    stroke="#111"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-shake mb-4 flex items-center gap-2.5 rounded-xl border-2 border-[#fc1d15]/20 bg-[#fc1d15]/[0.05] px-3 py-2.5">
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

                <p className="text-[11px] font-bold text-[#fc1d15]">
                  {error}
                </p>
              </div>
            )}

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="flex h-10.5 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-black/10 bg-white px-4 text-[11px] font-black text-black transition-all duration-200 hover:border-black hover:bg-[#fffdf8] hover:shadow-[3px_3px_0_#fcc615] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
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

                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />

              <span className="text-[8px] font-black text-black/25">
                OR
              </span>

              <div className="h-px flex-1 bg-black/10" />
            </div>

            {/* Form */}
            <form
              onSubmit={handleRegister}
              className="space-y-2.5"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-2.5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    disabled={
                      loading || googleLoading
                    }
                    className="h-10 w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 text-[11px] font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50"
                  >
                    Email
                  </label>

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
                    disabled={
                      loading || googleLoading
                    }
                    className="h-10 w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 text-[11px] font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Profile URL */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50"
                >
                  Profile Photo URL{" "}
                  <span className="normal-case text-black/25">
                    (optional)
                  </span>
                </label>

                <input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  placeholder="https://example.com/photo.jpg"
                  disabled={
                    loading || googleLoading
                  }
                  className="h-10 w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 text-[11px] font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50">
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-2.5">

                  {/* User */}
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    disabled={
                      loading || googleLoading
                    }
                    className={`flex h-10 items-center gap-2 rounded-lg border-2 px-2.5 text-left transition-all ${
                      role === "user"
                        ? "border-black bg-[#fff0ed] shadow-[2px_2px_0_#fc1d15]"
                        : "border-black/10 bg-[#fffdf8]"
                    }`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fc1d15] text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="M5.5 20c.8-3.7 2.9-5.5 6.5-5.5s5.7 1.8 6.5 5.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black leading-none">
                        User
                      </p>

                      <p className="mt-0.5 truncate text-[7px] font-medium text-black/35">
                        Borrow & discover
                      </p>
                    </div>
                  </button>

                  {/* Librarian */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("librarian")
                    }
                    disabled={
                      loading || googleLoading
                    }
                    className={`flex h-10 items-center gap-2 rounded-lg border-2 px-2.5 text-left transition-all ${
                      role === "librarian"
                        ? "border-black bg-[#fff7dc] shadow-[2px_2px_0_#fcc615]"
                        : "border-black/10 bg-[#fffdf8]"
                    }`}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fcc615] text-black">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                      >
                        <path
                          d="M5 20V7l7-3 7 3v13"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="M3 20h18M8 10v6M12 10v6M16 10v6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black leading-none">
                        Librarian
                      </p>

                      <p className="mt-0.5 truncate text-[7px] font-medium text-black/35">
                        Manage library
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-2.5">

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50"
                  >
                    Password
                  </label>

                  <div className="relative">
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
                      placeholder="Min. 8 chars"
                      autoComplete="new-password"
                      required
                      disabled={
                        loading || googleLoading
                      }
                      className="h-10 w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 pr-10 text-[11px] font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="password-eye group absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-black/30 hover:bg-[#fff7dc] hover:text-black"
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                        >
                          <path
                            d="M3 3l18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.9 5.1A10.8 10.8 0 0 1 12 4.9c5 0 8.5 5.1 8.5 5.1a15.7 15.7 0 0 1-3.1 3.5M6.6 6.6C4.4 8.1 3.5 10 3.5 10s3.5 5.1 8.5 5.1c1.1 0 2.1-.2 3-.6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                        >
                          <path
                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                            stroke="currentColor"
                            strokeWidth="2"
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-[9px] font-black uppercase tracking-wider text-black/50"
                  >
                    Confirm
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                      disabled={
                        loading || googleLoading
                      }
                      className="h-10 w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 pr-10 text-[11px] font-semibold text-black outline-none transition-all placeholder:text-black/25 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615] disabled:bg-gray-100"
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="password-eye group absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-black/30 hover:bg-[#fff7dc] hover:text-black"
                    >
                      {showConfirmPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                        >
                          <path
                            d="M3 3l18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.9 5.1A10.8 10.8 0 0 1 12 4.9c5 0 8.5 5.1 8.5 5.1a15.7 15.7 0 0 1-3.1 3.5M6.6 6.6C4.4 8.1 3.5 10 3.5 10s3.5 5.1 8.5 5.1c1.1 0 2.1-.2 3-.6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                        >
                          <path
                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                            stroke="currentColor"
                            strokeWidth="2"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-[#fc1d15] px-4 text-[11px] font-black text-white shadow-[3px_3px_0_#111] transition-all hover:-translate-y-0.5 hover:bg-[#e91912] hover:shadow-[4px_4px_0_#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account

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

            {/* Login */}
            <p className="mt-3 text-center text-[10px] font-medium text-black/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-[#fc1d15] transition-colors hover:text-black"
              >
                Login
              </Link>
            </p>
          </div>
        </section>

        {/* Back Home */}
        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-[9px] font-bold text-black/30 transition hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}