import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function BrandPanel({
  title,
  subtitle,
  highlightText,
  features,
  gradientIntensity = "medium",
}) {
  const gradientOpacity = {
    low: { first: "0.08", second: "0.05" },
    medium: { first: "0.1", second: "0.06" },
    high: { first: "0.15", second: "0.08" },
  };

  const opacity = gradientOpacity[gradientIntensity] || gradientOpacity.medium;

  return (
    <div className="brand-panel hidden lg:flex lg:w-1/2 bg-[#1d1d1f] relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f] via-[#2d2d2f] to-[#1d1d1f]" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,rgba(252,163,17,{opacity.first}),transparent_50%)]"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 20%,rgba(252,163,17,${opacity.first}),transparent 50%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 40% at 80% 80%,rgba(252,163,17,${opacity.second}),transparent)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex flex-col justify-between w-full px-12 xl:px-16 py-8 xl:py-10">
        <Link
          to="/"
          className="brand-logo inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors"
        >
          <img
            src="/campussync-icon.png"
            alt="CampusSync"
            className="h-10 w-auto object-contain"
          />
          <span className="text-lg font-medium tracking-tight">CampusSync</span>
        </Link>

        <div className="brand-text">
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold text-white tracking-[-0.02em] leading-tight max-w-md">
            {title}
            {highlightText && (
              <span className="block bg-gradient-to-r from-[#FCA311] to-[#FFD700] bg-clip-text text-transparent">
                {highlightText}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="mt-4 text-white/50 text-base max-w-sm leading-relaxed">
              {subtitle}
            </p>
          )}
          {features && features.length > 0 && (
            <ul className="mt-6 space-y-2">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-white/70 text-[14px]"
                >
                  <div className="w-4 h-4 rounded-full bg-[#FCA311]/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#FCA311]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-[13px] text-white/30">
          © {new Date().getFullYear()} CampusSync · Privacy · Terms
        </p>
      </div>
    </div>
  );
}
