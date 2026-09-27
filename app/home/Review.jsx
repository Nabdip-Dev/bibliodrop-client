"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Rahim Uddin",
    role: "Interior Architect",
    text: "The tile quality is outstanding and gives a premium finish to every project.",
    rating: 5,
    color: "#0ea5e9",
    rotate: "-6deg",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "Interior Designer",
    text: "Beautiful marble and wooden tile collection. Perfect for modern interiors.",
    rating: 4,
    color: "#f97316",
    rotate: "4deg",
  },
  {
    id: 3,
    name: "Imran Hossain",
    role: "Contractor",
    text: "Very reliable supply and excellent finishing quality. Highly recommended.",
    rating: 5,
    color: "#10b981",
    rotate: "-4deg",
  },
  {
    id: 4,
    name: "Sadia Rahman",
    role: "Architect",
    text: "Amazing collection and beautiful finishing. The quality really stands out.",
    rating: 5,
    color: "#8b5cf6",
    rotate: "5deg",
  },
  {
    id: 5,
    name: "Tanvir Hasan",
    role: "Builder",
    text: "The products are durable, stylish and the overall service is excellent.",
    rating: 4,
    color: "#ec4899",
    rotate: "-5deg",
  },
  {
    id: 6,
    name: "Mim Akter",
    role: "Interior Designer",
    text: "Loved the modern designs. Everything looked even better after installation.",
    rating: 5,
    color: "#06b6d4",
    rotate: "4deg",
  },
];

/* =========================================================
   GET CARD POSITION
========================================================= */

function getPosition(index, activeIndex, total) {
  let position = index - activeIndex;

  if (position > total / 2) {
    position -= total;
  }

  if (position < -total / 2) {
    position += total;
  }

  return position;
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({ review, position }) {
  const isCenter = position === 0;
  const isLeft = position === -1;
  const isRight = position === 1;

  let cardStyle;

  if (isCenter) {
    cardStyle = {
      x: "0%",
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 30,
    };
  } else if (isLeft) {
    cardStyle = {
      x: "-92%",
      scale: 0.82,
      rotate: -5,
      opacity: 0.6,
      zIndex: 20,
    };
  } else if (isRight) {
    cardStyle = {
      x: "92%",
      scale: 0.82,
      rotate: 5,
      opacity: 0.6,
      zIndex: 20,
    };
  } else if (position < -1) {
    cardStyle = {
      x: "-160%",
      scale: 0.65,
      rotate: -10,
      opacity: 0,
      zIndex: 10,
    };
  } else {
    cardStyle = {
      x: "160%",
      scale: 0.65,
      rotate: 10,
      opacity: 0,
      zIndex: 10,
    };
  }

  return (
    <motion.div
      className="
        absolute
        left-1/2
        top-1/2
        h-[250px]
        w-[280px]
        -translate-x-1/2
        -translate-y-1/2
        sm:w-[320px]
        md:w-[340px]
      "
      animate={cardStyle}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformOrigin: "center center",
      }}
    >
      {/* =================================================
          COLOR BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at top left,
              ${review.color} 0%,
              #ffffff 70%
            )`,
          }}
        />

        {/* GLOW */}

        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute -inset-10 blur-2xl"
            style={{
              background: `radial-gradient(
                circle,
                ${review.color}55,
                transparent 70%
              )`,
            }}
          />
        </div>

        {/* WHITE OVERLAY */}

        <div className="absolute inset-0 rounded-xl bg-white/50" />
      </div>

      {/* =================================================
          CLIENT REVIEW LABEL
      ================================================= */}

      <p
        className="
          absolute
          left-0
          right-0
          top-5
          z-10
          text-center
          text-sm
          tracking-widest
          text-gray-600
        "
      >
        <span className="italic text-gray-400">
          Costomer
        </span>{" "}
        <span className="font-bold">
          REVIEW
        </span>
      </p>

      {/* =================================================
          BACK PAPER
      ================================================= */}

      <div
        className="
          absolute
          left-1/2
          top-[62px]
          h-[150px]
          w-[240px]
          rounded-lg
          bg-[#ff21213c]
          opacity-80
        "
        style={{
          transform:
            "translateX(-50%) rotate(-8deg) translate(-20px,10px)",
        }}
      />

      {/* =================================================
          MAIN PAPER
      ================================================= */}

      <div
        className="
          absolute
          left-1/2
          top-[62px]
          h-[160px]
          w-[250px]
          rounded-lg
          bg-white
          border
          border-[#fc1d15]
          p-4
          shadow-md
        "
        style={{
          transform: `translateX(-50%) rotate(${review.rotate})`,
        }}
      >
        {/* USER */}

        <div className="mb-2 flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[9px]
              font-bold
              text-white
              shadow-md
            "
            style={{
              backgroundColor: review.color,
            }}
          >
            {review.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#1b0035]">
              {review.name}
            </p>

            <p className="text-[10px] text-gray-700">
              {review.role}
            </p>
          </div>
        </div>

        {/* REVIEW TEXT */}

        <p className="text-[11px] leading-relaxed text-gray-600">
          “{review.text}”
        </p>

        {/* RATING */}

        <div className="mt-2 text-sm text-yellow-500">
          {"★".repeat(review.rating)}

          <span className="text-gray-400">
            {"★".repeat(5 - review.rating)}
          </span>
        </div>

        {/* QUOTE */}

        <span
          className="
            absolute
            bottom-2
            right-3
            text-lg
            text-gray-700
          "
        >
          ”
        </span>
      </div>

      {/* =================================================
          CENTER CARD BORDER
      ================================================= */}

      {isCenter && (
        <motion.div
          className="
            pointer-events-none
            absolute
            -inset-2
            rounded-[18px]
            border
            border-[#fcc615]
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        />
      )}
    </motion.div>
  );
}

/* =========================================================
   MAIN REVIEWS COMPONENT
========================================================= */

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = reviews.length;

  /* =======================================================
     AUTO SLIDE
     EVERY 4 SECONDS
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % total;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [total]);

  return (
    <section
      className="
        relative
        flex
        min-h-[620px]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-r
        from-[#fff8e7]
        via-[#f2d58d]
        to-[#fff7e2]
        px-4
        py-20
      "
    >
      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-100px]
          top-20
          h-72
          w-72
          rounded-full
          bg-orange-400/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-10
          right-[-100px]
          h-80
          w-80
          rounded-full
          bg-yellow-400/10
          blur-3xl
        "
      />

      {/* =================================================
          HEADING
      ================================================= */}

      <motion.div
        className="
          relative
          z-10
          mb-10
          -mt-8
          flex
          flex-col
          items-center
          text-center
        "
        initial={{
          opacity: 0,
          y: -25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        {/* LOTTIE */}

        <span className="h-[100px] w-[100px]">
          <DotLottieReact
            src="https://lottie.host/4c6512d7-75e9-462d-9156-8883fe8f5def/A72F962FFG.lottie"
            loop
            autoplay
          />
        </span>

        <h2 className="-mt-3 text-2xl font-bold text-[#5a2100] sm:text-3xl">
          Customer Reviews
        </h2>

        <p className="mt-2 max-w-md text-xs leading-5 text-gray-500 sm:text-sm">
          See what our clients say about our quality,
          service and collection.
        </p>

        {/* SMALL LINE */}

        <div className="mt-4 flex items-center gap-2">
          <span className="h-[2px] w-8 rounded-full bg-orange-400" />

          <span className="h-2 w-2 rounded-full bg-yellow-400" />

          <span className="h-[2px] w-8 rounded-full bg-orange-400" />
        </div>
      </motion.div>

      {/* =================================================
          CAROUSEL
      ================================================= */}

      <div
        className="
          relative
          z-10
          h-[300px]
          w-full
          max-w-[1100px]
        "
      >
        {reviews.map((review, index) => {
          const position = getPosition(
            index,
            activeIndex,
            total
          );

          return (
            <ReviewCard
              key={review.id}
              review={review}
              position={position}
            />
          );
        })}
      </div>

      {/* =================================================
          DOT INDICATOR
      ================================================= */}

      <div className="relative z-20 mt-3 flex items-center gap-1.5">
        {reviews.map((review, index) => (
          <button
            key={review.id}
            type="button"
            aria-label={`Go to review ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className="
              h-1.5
              rounded-full
              transition-all
              duration-500
            "
            style={{
              width:
                index === activeIndex
                  ? "24px"
                  : "6px",

              backgroundColor:
                index === activeIndex
                  ? review.color
                  : "#d1d5db",
            }}
          />
        ))}
      </div>
    </section>
  );
}
