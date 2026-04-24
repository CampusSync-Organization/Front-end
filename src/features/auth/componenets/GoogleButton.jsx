import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
export default function GoogleButton({ onSuccess, onError, className = "" }) {
  return (
    <div className={`w-full relative ${className}`}>
      {/* Your visual custom button */}
      <button
        type="button"
        className="w-full h-11 rounded-xl border border-[#dadce0] bg-white hover:bg-[#f8f9fa] 
                   active:bg-[#f8f9fa] flex items-center justify-center gap-3 
                   text-[#3c4043] font-medium text-[15px] transition-all 
                   shadow-sm hover:shadow-md disabled:opacity-70 pointer-events-none"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      {/* Google button stretched over the top */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: 0.001 }} // nearly invisible but still clickable
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              await onSuccess?.(credentialResponse.credential);
            } catch (error) {
              onError?.(error);
            }
          }}
          onError={() => {
            console.error("Google sign-in failed");
            onError?.();
          }}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="400"
          locale="en"
          style={{ transform: "scaleX(3)" }} // stretch to fill width
        />
      </div>
    </div>
  );
}
