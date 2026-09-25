"use client";

export default function ReviewCard({ review }) {
  const userName = review?.userName || "Anonymous Reader";
  const userImage = review?.userImage || "";
  const rating = Number(review?.rating) || 0;
  const comment = review?.comment || "No comment provided.";

  return (
    <article className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4 transition-all duration-300 hover:border-[#fc1d15]/20 hover:shadow-sm">
      <div className="flex gap-3">
        {/* User Photo */}
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Review Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black text-black">
              {userName}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 ${
                    star <= rating
                      ? "text-[#fcc615]"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                >
                  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Description / Comment */}
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {comment}
          </p>

          {/* Date */}
          {review?.createdAt && (
            <p className="mt-2 text-[10px] font-semibold text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}