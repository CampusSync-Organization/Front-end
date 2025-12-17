import React from "react";

const ReviewItem = ({ review }) => (
  <div className="w-full p-6 bg-white rounded-xl border border-gray-100 mb-0 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Fallback avatar if none provided */}
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.author}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            review.author.charAt(0)
          )}
        </div>
        <span className="text-slate-900 text-sm font-semibold">
          {review.author}
        </span>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? "text-amber-400" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
    <p className="text-slate-600 text-sm font-medium leading-relaxed">
      {review.text}
    </p>
  </div>
);

export const UserReviews = ({ reviews }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-10">
      <h2 className="text-slate-900 text-xl font-bold mb-8">Reviews</h2>
      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
