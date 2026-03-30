export default function TermsLinks({ className = "" }) {
  return (
    <p className={`mt-5 text-center text-[12px] text-[#86868b] ${className}`}>
      By continuing, you agree to our{" "}
      <a href="#" className="underline hover:text-[#1d1d1f]">
        Terms
      </a>{" "}
      and{" "}
      <a href="#" className="underline hover:text-[#1d1d1f]">
        Privacy Policy
      </a>
    </p>
  );
}
