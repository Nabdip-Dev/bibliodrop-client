import React from "react";
import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Star,
} from "lucide-react";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 lg:px-8">

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute -left-24 top-10
          h-56 w-56
          rounded-full
          bg-[#fcc615]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute -right-24 bottom-0
          h-64 w-64
          rounded-full
          bg-[#fc1d15]/10
          blur-3xl
        "
      />

      {/* =====================================================
          MAIN CTA CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-6xl">

        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-black/10
            bg-gradient-to-br
            from-white
            via-white
            to-[#fcc615]/[0.04]
            px-6
            py-10
            shadow-[0_20px_60px_rgba(0,0,0,0.07)]
            transition-all
            duration-700
            hover:shadow-[0_25px_80px_rgba(0,0,0,0.11)]
            sm:px-8
            sm:py-12
            lg:px-12
            lg:py-14
          "
        >

          {/* =================================================
              DECORATIVE CIRCLES
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              border-[18px]
              border-[#fcc615]/10
              transition-transform
              duration-1000
              group-hover:scale-125
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-20
              h-48
              w-48
              rounded-full
              border-[18px]
              border-[#fc1d15]/5
              transition-transform
              duration-1000
              group-hover:scale-110
            "
          />

          {/* Small dots */}

          <span
            className="
              absolute
              right-[38%]
              top-8
              h-2
              w-2
              rounded-full
              bg-[#fcc615]
              opacity-70
              animate-pulse
            "
          />

          <span
            className="
              absolute
              bottom-8
              left-[45%]
              h-1.5
              w-1.5
              rounded-full
              bg-[#fc1d15]
              opacity-60
              animate-pulse
            "
          />

          {/* =================================================
              CONTENT GRID
          ================================================== */}

          <div
            className="
              relative
              grid
              items-center
              gap-10
              lg:grid-cols-2
              lg:gap-14
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div className="max-w-xl">

              {/* Badge */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-black/10
                  bg-[#fcc615]/10
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-black
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:bg-[#fcc615]/20
                "
              >
                <Sparkles
                  className="h-4 w-4 text-[#fc1d15]"
                />

                <span>
                  Start Your Reading Journey
                </span>
              </div>

              {/* Heading */}

              <h2
                className="
                  text-3xl
                  font-bold
                  leading-[1.12]
                  tracking-tight
                  text-black
                  sm:text-4xl
                  lg:text-[42px]
                "
              >
                Your next great story

                <span
                  className="
                    mt-1
                    block
                    font-serif
                    text-[#fc1d15]
                    italic
                    font-normal
                  "
                >
                  is waiting for you.
                </span>
              </h2>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-lg
                  text-sm
                  leading-6
                  text-black/55
                  sm:text-base
                "
              >
                Discover amazing books, explore inspiring authors,
                and find stories that make every reading moment
                memorable.
              </p>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                {/* ================= PRIMARY ================= */}

                {/* Explore Books */}
                <Link
                  href="/browse-books"
                  className="
    group/btn
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-full
    border
    border-[#fcc615]/40
    bg-[#fcc615]/80
    px-6
    py-3
    text-sm
    font-bold
    text-black
    shadow-[0_8px_25px_rgba(252,198,21,0.22)]
    backdrop-blur-sm
    transition-all
    duration-500
    hover:-translate-y-1
    hover:bg-[#fcc615]
    hover:shadow-[0_12px_30px_rgba(252,198,21,0.35)]
    active:scale-95
  "
                >
                  Explore Books

                  <ArrowRight
                    className="
      h-4
      w-4
      transition-transform
      duration-500
      group-hover/btn:translate-x-1
    "
                  />
                </Link>

                {/* Browse Collection */}
                <Link
                  href="/browse-books"
                  className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-full
    border
    border-black/15
    bg-white
    px-6
    py-3
    text-sm
    font-semibold
    text-black
    transition-all
    duration-500
    hover:-translate-y-1
    hover:border-[#fc1d15]
    hover:text-[#fc1d15]
    hover:shadow-[0_8px_25px_rgba(252,29,21,0.08)]
    active:scale-95
  "
                >
                  <BookOpen className="h-4 w-4" />

                  Browse Collection
                </Link>


              </div>

              {/* =================================================
                  RATING
              ================================================== */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-3
                "
              >

                <div className="flex">

                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star
                      key={item}
                      className="
                        -ml-0.5
                        h-4
                        w-4
                        fill-[#fcc615]
                        text-[#fcc615]
                      "
                    />
                  ))}

                </div>

                <span
                  className="
                    text-xs
                    text-black/45
                  "
                >
                  Loved by thousands of readers
                </span>

              </div>

            </div>

            {/* =================================================
                RIGHT BOOK VISUAL
            ================================================== */}

            <div
              className="
                relative
                mx-auto
                h-[270px]
                w-full
                max-w-sm
              "
            >

              {/* Main Glow */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-44
                  w-44
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#fcc615]/15
                  blur-3xl
                  transition-all
                  duration-1000
                  group-hover:scale-125
                "
              />

              {/* =================================================
                  LEFT BOOK
              ================================================== */}

              <div
                className="
                  absolute
                  left-[8%]
                  top-[20%]
                  w-32
                  rotate-[-12deg]
                  rounded-xl
                  bg-black
                  p-3.5
                  shadow-[0_18px_35px_rgba(0,0,0,0.18)]
                  transition-all
                  duration-700
                  group-hover:-translate-x-3
                  group-hover:-rotate-[17deg]
                "
              >

                <div
                  className="
                    flex
                    h-28
                    flex-col
                    justify-between
                    rounded-lg
                    border
                    border-white/15
                    bg-black
                    p-3
                  "
                >

                  <div>

                    <div
                      className="
                        h-2
                        w-12
                        rounded-full
                        bg-[#fcc615]
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-1.5
                        w-16
                        rounded-full
                        bg-white/25
                      "
                    />

                  </div>

                  <div
                    className="
                      text-center
                      font-serif
                      text-sm
                      text-white
                    "
                  >
                    Stories
                  </div>

                  <div
                    className="
                      h-1
                      w-8
                      rounded-full
                      bg-[#fc1d15]
                    "
                  />

                </div>

              </div>

              {/* =================================================
                  RIGHT BOOK
              ================================================== */}

              <div
                className="
                  absolute
                  right-[7%]
                  top-[10%]
                  w-32
                  rotate-[12deg]
                  rounded-xl
                  bg-[#fc1d15]
                  p-3.5
                  shadow-[0_18px_35px_rgba(252,29,21,0.18)]
                  transition-all
                  duration-700
                  group-hover:translate-x-3
                  group-hover:rotate-[17deg]
                "
              >

                <div
                  className="
                    flex
                    h-28
                    flex-col
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-white/25
                    bg-[#fc1d15]
                    p-3
                  "
                >

                  <Sparkles
                    className="
                      h-5
                      w-5
                      text-[#fcc615]
                    "
                  />

                  <div
                    className="
                      text-center
                      font-serif
                      text-lg
                      text-white
                    "
                  >
                    Read.
                  </div>

                  <div
                    className="
                      h-1
                      w-10
                      rounded-full
                      bg-[#fcc615]
                    "
                  />

                </div>

              </div>

              {/* =================================================
                  CENTER BOOK
              ================================================== */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-10
                  w-40
                  -translate-x-1/2
                  -translate-y-1/2
                  rotate-[-3deg]
                  rounded-2xl
                  bg-[#fcc615]/90
                  p-3.5
                  shadow-[0_25px_55px_rgba(0,0,0,0.18)]
                  backdrop-blur-sm
                  transition-all
                  duration-700
                  group-hover:-translate-y-[55%]
                  group-hover:rotate-0
                "
              >

                <div
                  className="
                    flex
                    h-36
                    flex-col
                    justify-between
                    rounded-xl
                    bg-white
                    p-4
                  "
                >

                  <div>

                    <div
                      className="
                        h-2
                        w-16
                        rounded-full
                        bg-[#fc1d15]
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-1.5
                        w-24
                        rounded-full
                        bg-black/10
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-1.5
                        w-16
                        rounded-full
                        bg-black/10
                      "
                    />

                  </div>

                  <div className="text-center">

                    <div
                      className="
                        font-serif
                        text-2xl
                        font-semibold
                        italic
                        text-black
                      "
                    >
                      Read.
                    </div>

                    <div
                      className="
                        mt-1
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-[#fc1d15]
                      "
                    >
                      Discover · Imagine
                    </div>

                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span
                      className="
                        h-1.5
                        w-7
                        rounded-full
                        bg-[#fcc615]
                      "
                    />

                    <span
                      className="
                        h-1.5
                        w-7
                        rounded-full
                        bg-[#fc1d15]
                      "
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  FLOATING SPARKLE
              ================================================== */}

              <div
                className="
                  absolute
                  bottom-[13%]
                  left-[8%]
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-white
                  shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                  transition-transform
                  duration-700
                  group-hover:-translate-y-3
                "
              >

                <Sparkles
                  className="
                    h-4
                    w-4
                    text-[#fc1d15]
                  "
                />

              </div>

              {/* =================================================
                  RATING CARD
              ================================================== */}

              <div
                className="
                  absolute
                  bottom-[7%]
                  right-[2%]
                  rounded-xl
                  border
                  border-black/10
                  bg-white/90
                  px-3
                  py-2.5
                  shadow-[0_12px_30px_rgba(0,0,0,0.09)]
                  backdrop-blur-md
                  transition-transform
                  duration-700
                  group-hover:translate-y-2
                "
              >

                <div className="flex items-center gap-1">

                  <Star
                    className="
                      h-3.5
                      w-3.5
                      fill-[#fcc615]
                      text-[#fcc615]
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-bold
                      text-black
                    "
                  >
                    4.9
                  </span>

                </div>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-black/45
                  "
                >
                  Reader rating
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CTA;
