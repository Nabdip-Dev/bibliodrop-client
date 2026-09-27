"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

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

  const disabled = loading || googleLoading;

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setError("");
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // REGISTER
  // =========================================================
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

      const roleResponse = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const roleData = await roleResponse.json();

      if (!roleResponse.ok) {
        setError(
          roleData.message ||
            "Failed to save account role."
        );
        return;
      }

      await authClient.signOut();

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

  // =========================================================
  // GOOGLE
  // =========================================================
  const handleGoogleRegister = async () => {
    setError("");

    try {
      setGoogleLoading(true);

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
    <main className="min-h-screen bg-[#f5f3ee] text-[#111]">

      <div className="mx-auto flex min-h-screen w-full max-w-5xl">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <aside className="relative hidden w-[34%] overflow-hidden bg-[#171717] px-7 py-6 lg:flex lg:flex-col lg:justify-between">

          {/* Decorations */}
          <div className="absolute -right-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#fc1d15]" />

          <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full border-[18px] border-[#fcc615]" />

          <div className="absolute right-8 top-8 h-2.5 w-2.5 bg-[#fcc615]" />

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

              <svg
                viewBox="0 0 48 48"
                className="h-4.5 w-4.5"
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

            <span className="text-lg font-black text-white">
              Biblio
              <span className="text-[#fcc615]">
                Drop
              </span>
            </span>
          </Link>

          {/* Center */}
          <div className="relative z-10">

            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.25em] text-white/40">
              YOUR LOCAL LIBRARY
            </p>

            <h2 className="text-[43px] font-black leading-[0.88] tracking-[-0.06em] text-white">
              Read.
              <br />
              Discover.
              <br />
              <span className="text-[#fcc615]">
                Repeat.
              </span>
            </h2>

            <p className="mt-5 max-w-[210px] text-[10px] font-medium leading-5 text-white/40">
              Find your next favorite book and
              connect with your local library.
            </p>

          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center gap-2">

            <span className="h-1.5 w-1.5 bg-[#fc1d15]" />

            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
              Read · Discover · Share
            </span>

          </div>

        </aside>

        {/* =====================================================
            FORM SIDE
        ====================================================== */}
        <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-5 sm:px-8 lg:px-9">

          <div className="w-full max-w-[470px]">

            {/* Mobile header */}
            <div className="mb-4 flex items-center justify-between lg:hidden">

              <Link
                href="/"
                className="text-lg font-black"
              >
                Biblio
                <span className="text-[#fc1d15]">
                  Drop
                </span>
              </Link>

              <Link
                href="/login"
                className="text-[8px] font-black uppercase text-black/45"
              >
                Login
              </Link>

            </div>

            {/* =================================================
                HEADING
            ================================================== */}
            <div className="mb-4">

              <div className="mb-1.5 flex items-center gap-2">

                <span className="h-1.5 w-1.5 bg-[#fc1d15]" />

                <span className="text-[7px] font-black uppercase tracking-[0.22em] text-black/40">
                  Create account
                </span>

              </div>

              <h1 className="text-[29px] font-black leading-none tracking-[-0.055em] sm:text-[32px]">
                Join{" "}
                <span className="text-[#fc1d15]">
                  BiblioDrop
                </span>
              </h1>

              <p className="mt-1.5 text-[9px] font-semibold text-black/40">
                Create your account and start reading.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================== */}
            {error && (
              <div className="mb-3 rounded-lg bg-[#fc1d15] px-3 py-2">

                <p className="text-[8px] font-bold text-white">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                GOOGLE
            ================================================== */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={disabled}
              className="flex h-9.5 w-full items-center justify-center gap-2 rounded-lg bg-white text-[8px] font-black ring-1 ring-black/10 transition hover:ring-black/20 disabled:opacity-50"
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
            <div className="my-3 flex items-center gap-3">

              <div className="h-px flex-1 bg-black/10" />

              <span className="text-[7px] font-black text-black/30">
                OR
              </span>

              <div className="h-px flex-1 bg-black/10" />

            </div>

            {/* =================================================
                FORM
            ================================================== */}
            <form
              onSubmit={handleRegister}
              className="space-y-2.5"
            >

              {/* =================================================
                  NAME + EMAIL
              ================================================== */}
              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="name"
                    className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50"
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
                    disabled={disabled}
                    className="h-8.5 w-full rounded-md border border-black/10 bg-white px-3 text-[9px] font-bold outline-none transition placeholder:text-black/25 focus:border-[#fc1d15] focus:ring-2 focus:ring-[#fc1d15]/5 disabled:opacity-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="email"
                    className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50"
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
                    disabled={disabled}
                    className="h-8.5 w-full rounded-md border border-black/10 bg-white px-3 text-[9px] font-bold outline-none transition placeholder:text-black/25 focus:border-[#fc1d15] focus:ring-2 focus:ring-[#fc1d15]/5 disabled:opacity-50"
                  />

                </div>

              </div>

              {/* =================================================
                  PROFILE IMAGE
              ================================================== */}
              <div>

                <label className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50">
                  Profile Photo
                  <span className="ml-1 font-medium normal-case tracking-normal text-black/30">
                    optional
                  </span>
                </label>

                <div className="flex h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-2">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fcc615]">

                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
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
                    )}

                  </div>

                  <input
                    type="url"
                    value={
                      image.startsWith("data:")
                        ? ""
                        : image
                    }
                    onChange={(e) =>
                      setImage(e.target.value)
                    }
                    placeholder="Image URL"
                    disabled={disabled}
                    className="min-w-0 flex-1 bg-transparent px-1 text-[8px] font-bold outline-none placeholder:text-black/25"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={disabled}
                    className="h-7 shrink-0 rounded bg-[#fcc615] px-2.5 text-[7px] font-black uppercase transition hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    Upload
                  </button>

                </div>

                <p className="mt-0.5 text-[6px] font-semibold text-black/25">
                  JPG · PNG · WEBP · Max 2MB
                </p>

              </div>

              {/* =================================================
                  ACCOUNT TYPE - SMALL SEGMENTED OPTION
              ================================================== */}
              <div>

                <label className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50">
                  Account Type
                </label>

                <div className="inline-flex w-full rounded-md bg-black/[0.045] p-1">

                  {/* USER */}
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    disabled={disabled}
                    className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded transition-all ${
                      role === "user"
                        ? "bg-white text-[#fc1d15] shadow-sm"
                        : "text-black/40 hover:text-black"
                    }`}
                  >

                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        role === "user"
                          ? "border-[#fc1d15] bg-[#fc1d15]"
                          : "border-black/20"
                      }`}
                    />

                    <span className="text-[8px] font-black">
                      User
                    </span>

                    <span className="hidden text-[6px] font-semibold text-black/30 sm:inline">
                      · Borrow books
                    </span>

                  </button>

                  {/* LIBRARIAN */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("librarian")
                    }
                    disabled={disabled}
                    className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded transition-all ${
                      role === "librarian"
                        ? "bg-white text-[#111] shadow-sm"
                        : "text-black/40 hover:text-black"
                    }`}
                  >

                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        role === "librarian"
                          ? "border-[#fcc615] bg-[#fcc615]"
                          : "border-black/20"
                      }`}
                    />

                    <span className="text-[8px] font-black">
                      Librarian
                    </span>

                    <span className="hidden text-[6px] font-semibold text-black/30 sm:inline">
                      · Manage library
                    </span>

                  </button>

                </div>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}
              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="password"
                    className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50"
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
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      required
                      disabled={disabled}
                      className="h-8.5 w-full rounded-md border border-black/10 bg-white px-3 pr-10 text-[9px] font-bold outline-none transition placeholder:text-black/25 focus:border-[#fc1d15] focus:ring-2 focus:ring-[#fc1d15]/5 disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (v) => !v
                        )
                      }
                      disabled={disabled}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[6px] font-black uppercase text-black/35 hover:text-[#fc1d15]"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-[7px] font-black uppercase tracking-wider text-black/50"
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
                      disabled={disabled}
                      className="h-8.5 w-full rounded-md border border-black/10 bg-white px-3 pr-10 text-[9px] font-bold outline-none transition placeholder:text-black/25 focus:border-[#fcc615] focus:ring-2 focus:ring-[#fcc615]/10 disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (v) => !v
                        )
                      }
                      disabled={disabled}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[6px] font-black uppercase text-black/35 hover:text-[#fcc615]"
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}
              <button
                type="submit"
                disabled={disabled}
                className="group mt-0.5 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#fc1d15] text-[8px] font-black uppercase tracking-[0.15em] text-white shadow-[0_5px_18px_rgba(252,29,21,0.15)] transition-all hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account

                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
                FOOTER
            ================================================== */}
            <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">

              <Link
                href="/"
                className="text-[7px] font-bold text-black/30 transition hover:text-black"
              >
                ← Back Home
              </Link>

              <p className="text-[7px] font-semibold text-black/35">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black text-[#fc1d15] hover:text-black"
                >
                  Login
                </Link>
              </p>

            </div>

          </div>

        </section>
      </div>
    </main>
  );
}
