import { useState } from "react";
import { resolveAvatarUrl } from "../hooks/resolveAvatarUrl";

const getInitials = (name = "") => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || "?";
};

export const UserAvatar = ({
  src,
  name,
  alt,
  className = "",
  fallbackClassName = "",
  imgClassName = "",
  loading = "lazy",
}) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const resolvedSrc = src !== failedSrc ? resolveAvatarUrl(src) : null;

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || name || "User avatar"}
        loading={loading}
        className={className || imgClassName}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center bg-secondary/10 text-secondary font-bold ${className} ${fallbackClassName}`}
      aria-label={alt || name || "User avatar"}
      role="img"
    >
      {getInitials(name)}
    </span>
  );
};
