export default function AuthDivider({ className = "" }) {
  return (
    <div className={`flex items-center gap-4 my-5 ${className}`}>
      <div className="flex-1 h-px bg-[#d2d2d7]" />
      <span className="text-[12px] text-[#86868b] uppercase tracking-wide">
        or
      </span>
      <div className="flex-1 h-px bg-[#d2d2d7]" />
    </div>
  );
}
