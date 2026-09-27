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
  // GOOGLE REGISTER
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
    <main className="relative min-h-screen overflow-hidden bg-[#f5f3ee] text-[#111]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#fcc615]/10 blur-3xl animate-[float_10s_ease-in-out_infinite]" />

        <div className="absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-[#fc1d15]/10 blur-3xl animate-[float_12s_ease-in-out_infinite_reverse]" />

        <div className="absolute left-[48%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#fc1d15] animate-pulse" />

        <div className="absolute right-[15%] top-[72%] h-1.5 w-1.5 rounded-full bg-[#fcc615] animate-pulse" />

      </div>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl p-2 sm:p-3 lg:p-4">

        {/* ===================================================
            LEFT BRAND PANEL
        ==================================================== */}

        <aside className="relative hidden w-[38%] overflow-hidden rounded-[24px] bg-[#171717] lg:flex lg:flex-col lg:justify-between">

          {/* Red circle */}
          <div className="absolute -right-28 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#fc1d15] transition-transform duration-1000 hover:scale-110" />

          {/* Yellow ring */}
          <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full border-[20px] border-[#fcc615] animate-[spin_22s_linear_infinite]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Logo */}

          <Link
            href="/"
            className="group relative z-10 flex items-center gap-2.5 p-7"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105">

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

            <span className="text-lg font-black text-white">
              Biblio
              <span className="text-[#fcc615]">
                Drop
              </span>
            </span>
          </Link>

          {/* Center */}

          <div className="relative z-10 px-9 pb-9">

            <div className="mb-5 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15] shadow-[0_0_12px_#fc1d15]" />

              <span className="text-[8px] font-black uppercase tracking-[0.28em] text-white/35">
                Your local library
              </span>

            </div>

            <h2 className="text-[52px] font-black leading-[0.85] tracking-[-0.07em] text-white">

              Read.
              <br />

              Discover.
              <br />

              <span className="text-[#fcc615]">
                Repeat.
              </span>

            </h2>

            <p className="mt-6 max-w-[250px] text-[10px] font-medium leading-5 text-white/35">
              Find your next favorite book,
              discover new stories and connect
              with your local library.
            </p>

            <div className="mt-7 flex items-center gap-2">

              <div className="h-px w-8 bg-[#fc1d15]" />

              <span className="text-[7px] font-black uppercase tracking-[0.25em] text-white/25">
                Read · Discover · Share
              </span>

            </div>

          </div>

        </aside>

        {/* ===================================================
            FORM AREA
        ==================================================== */}

        <section className="flex min-w-0 flex-1 items-center justify-center px-2 py-3 sm:px-5 lg:px-8">

          <div className="w-full max-w-[480px]">

            {/* =================================================
                MOBILE HEADER
            ================================================== */}

            <div className="mb-5 flex items-center justify-between lg:hidden">

              <Link
                href="/"
                className="text-lg font-black tracking-tight"
              >
                Biblio
                <span className="text-[#fc1d15]">
                  Drop
                </span>
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[7px] font-black uppercase tracking-wider transition-all hover:border-[#fc1d15] hover:text-[#fc1d15]"
              >
                Login
              </Link>

            </div>

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="mb-5 animate-[fadeUp_.5s_ease-out]">

              <div className="mb-2 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

                <span className="text-[7px] font-black uppercase tracking-[0.28em] text-black/35">
                  Create account
                </span>

              </div>

              <h1 className="text-[32px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[36px]">

                Join{" "}

                <span className="text-[#fc1d15]">
                  BiblioDrop
                </span>

              </h1>

              <p className="mt-2 text-[9px] font-semibold leading-4 text-black/40">
                Create your account and start your reading journey.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-[#fc1d15]/10 bg-[#fc1d15]/10 px-3 py-2.5 animate-[shake_.35s_ease-in-out]">

                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fc1d15] text-[9px] font-black text-white">
                  !
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
              onClick={handleGoogleRegister}
              disabled={disabled}
              className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-white text-[8px] font-black ring-1 ring-black/[0.08] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-black/15 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
            >

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.025] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {googleLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/10 border-t-black" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110"
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

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-4 flex items-center gap-3">

              <div className="h-px flex-1 bg-black/[0.08]" />

              <span className="text-[7px] font-black tracking-widest text-black/25">
                OR
              </span>

              <div className="h-px flex-1 bg-black/[0.08]" />

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleRegister}
              className="space-y-3"
            >

              {/* NAME + EMAIL */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <Field
                  label="Full Name"
                  htmlFor="name"
                >
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
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Email"
                  htmlFor="email"
                >
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
                    className={inputClass}
                  />
                </Field>

              </div>

              {/* =================================================
                  PROFILE PHOTO
              ================================================== */}

              <div>

                <label className={labelClass}>
                  Profile Photo

                  <span className="ml-1 normal-case tracking-normal text-black/25">
                    optional
                  </span>
                </label>

                <div className="group flex h-11 items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-2.5 shadow-sm transition-all duration-300 focus-within:border-[#fc1d15]/40 focus-within:shadow-[0_0_0_3px_rgba(252,29,21,0.05)]">

                  {/* Avatar */}

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fcc615] transition-transform duration-300 group-hover:scale-105">

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

                  {/* URL */}

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
                    placeholder="Paste image URL"
                    disabled={disabled}
                    className="min-w-0 flex-1 bg-transparent text-[9px] font-bold outline-none placeholder:text-black/25"
                  />

                  {/* Hidden file input */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Upload Icon Button */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={disabled}
                    aria-label="Upload profile photo"
                    title="Upload profile photo"
                    className="group/upload flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fcc615] text-[#111] transition-all duration-300 hover:bg-[#111] hover:text-white hover:shadow-md active:scale-90 disabled:opacity-50"
                  >

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover/upload:-translate-y-0.5"
                    >
                      <path
                        d="M12 16V4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="m7 9 5-5 5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M5 20h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                  </button>

                </div>

                <p className="mt-1 text-[6px] font-semibold text-black/25">
                  JPG · PNG · WEBP · Maximum 2MB
                </p>

              </div>

              {/* =================================================
                  ACCOUNT TYPE
              ================================================== */}

              <div>

                <label className={labelClass}>
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-black/[0.045] p-1">

                  <RoleButton
                    active={role === "user"}
                    onClick={() =>
                      setRole("user")
                    }
                    disabled={disabled}
                    color="red"
                    title="User"
                    description="Borrow books"
                  />

                  <RoleButton
                    active={role === "librarian"}
                    onClick={() =>
                      setRole("librarian")
                    }
                    disabled={disabled}
                    color="yellow"
                    title="Librarian"
                    description="Manage library"
                  />

                </div>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <Field
                  label="Password"
                  htmlFor="password"
                >
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    visible={showPassword}
                    setVisible={setShowPassword}
                    disabled={disabled}
                  />
                </Field>

                <Field
                  label="Confirm Password"
                  htmlFor="confirmPassword"
                >
                  <PasswordInput
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Repeat password"
                    visible={showConfirmPassword}
                    setVisible={
                      setShowConfirmPassword
                    }
                    disabled={disabled}
                  />
                </Field>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={disabled}
                className="group relative mt-1 flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#fc1d15] text-[8px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(252,29,21,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
              >

                {/* Shine */}

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account

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
                FOOTER
            ================================================== */}

            <div className="mt-4 flex flex-col-reverse items-center justify-between gap-2 border-t border-black/[0.08] pt-3 sm:flex-row">

              <Link
                href="/"
                className="text-[7px] font-bold text-black/30 transition-all duration-300 hover:-translate-x-1 hover:text-black"
              >
                ← Back Home
              </Link>

              <p className="text-[7px] font-semibold text-black/35">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-black text-[#fc1d15] transition-colors hover:text-black"
                >
                  Login
                </Link>

              </p>

            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-18px);
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
      `}</style>

    </main>
  );
}

/* =========================================================
   SHARED STYLES
========================================================= */

const inputClass =
  "h-10 w-full rounded-lg border border-black/[0.08] bg-white px-3 text-[9px] font-bold outline-none shadow-sm transition-all duration-300 placeholder:text-black/25 hover:border-black/15 focus:border-[#fc1d15]/40 focus:shadow-[0_0_0_3px_rgba(252,29,21,0.05)] disabled:opacity-50";

const labelClass =
  "mb-1 block text-[7px] font-black uppercase tracking-[0.16em] text-black/45";

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  htmlFor,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={labelClass}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  visible,
  setVisible,
  disabled,
}) {
  return (
    <div className="relative">

      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password"
        required
        disabled={disabled}
        className={`${inputClass} pr-12`}
      />

      <button
        type="button"
        onClick={() =>
          setVisible((v) => !v)
        }
        disabled={disabled}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded px-1.5 py-1 text-[6px] font-black uppercase tracking-wider text-black/30 transition-all hover:bg-black/5 hover:text-[#fc1d15] disabled:opacity-50"
      >
        {visible ? "Hide" : "Show"}
      </button>

    </div>
  );
}

/* =========================================================
   ROLE BUTTON
========================================================= */

function RoleButton({
  active,
  onClick,
  disabled,
  color,
  title,
  description,
}) {
  const isRed = color === "red";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex h-10 items-center justify-center gap-1.5 rounded-md transition-all duration-300 ${
        active
          ? "bg-white shadow-sm"
          : "text-black/35 hover:bg-white/60 hover:text-black"
      }`}
    >

      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          active
            ? isRed
              ? "border-[#fc1d15] bg-[#fc1d15]"
              : "border-[#fcc615] bg-[#fcc615]"
            : "border-black/15"
        }`}
      >
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </span>

      <span className="text-left">

        <span
          className={`block text-[8px] font-black ${
            active
              ? isRed
                ? "text-[#fc1d15]"
                : "text-[#111]"
              : ""
          }`}
        >
          {title}
        </span>

        <span className="block text-[6px] font-semibold text-black/25">
          {description}
        </span>

      </span>

    </button>
  );
}
