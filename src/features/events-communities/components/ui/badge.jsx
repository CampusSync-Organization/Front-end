export function Badge({ variant = "default", className = "", children, ...props }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  const variants = {
    default: "bg-primary text-white border-0",
    secondary: "bg-muted text-muted-foreground border-0",
    outline: "border border-border bg-transparent",
    destructive: "bg-destructive/10 text-destructive border-0",
  };
  return (
    <span
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
