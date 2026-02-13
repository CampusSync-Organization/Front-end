import { Star, MessageSquare } from "lucide-react";

const ReviewItem = ({ review }) => (
  <div className="w-full p-6 bg-slate-50 rounded-xl border border-border-light flex flex-col gap-4 hover:border-secondary transition-colors group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Fallback avatar if none provided */}
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            review.author.charAt(0)
          )}
        </div>
        <div>
          <span className="text-primary text-sm font-bold block">
            {review.author}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Student
          </span>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < review.rating
                ? "text-orange-400 fill-orange-400"
                : "text-slate-200 fill-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
      "{review.text}"
    </p>
  </div>
);

export const UserReviews = ({ reviews }) => {
  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <h2 className="text-xl font-bold flex items-center gap-2 text-primary mb-6">
        <MessageSquare className="text-secondary" size={24} /> Reviews
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};
