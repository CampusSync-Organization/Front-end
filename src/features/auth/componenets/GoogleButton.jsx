import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";

export default function GoogleButton({ onSuccess, onError, className = "" }) {
  const googleButtonRef = useRef(null);

  return (
    <div className={`w-full relative ${className}`}>
      {/* Hidden Google Button */}
      <div
        ref={googleButtonRef}
        className="absolute inset-0 opacity-0 pointer-events-auto z-10"
        style={{ width: "100%", height: "100%" }}
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log("Google response:", credentialResponse);
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
          width="100%"
          locale="en"
        />
      </div>

      {/* Your Custom Button */}
      <button
        type="button"
        onClick={() => {
          // Trigger click on the hidden Google button
          googleButtonRef.current?.querySelector('div[role="button"]')?.click();
        }}
        className="w-full h-11 rounded-xl border border-[#dadce0] bg-white hover:bg-[#f8f9fa] 
                   active:bg-[#f8f9fa] flex items-center justify-center gap-3 
                   text-[#3c4043] font-medium text-[15px] transition-all 
                   shadow-sm hover:shadow-md disabled:opacity-70"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}
