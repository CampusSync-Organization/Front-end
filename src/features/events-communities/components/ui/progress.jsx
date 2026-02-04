export function Progress({ value = 0, className = "", ...props }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary/20 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
