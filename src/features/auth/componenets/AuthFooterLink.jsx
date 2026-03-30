import { Link } from "react-router-dom";

export default function AuthFooterLink({
  question,
  linkText,
  linkTo,
  className = "",
}) {
  return (
    <p className={`mt-5 text-center text-[14px] text-[#86868b] ${className}`}>
      {question}
      <Link
        to={linkTo}
        className="font-medium text-[#FCA311] hover:text-[#E89310] transition-colors"
      >
        {linkText}
      </Link>
    </p>
  );
}
