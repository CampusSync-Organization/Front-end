import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  id,
  name,
  label,
  placeholder = "••••••••",
  required = false,
  autoComplete,
  minLength,
  showForgotPassword = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-field space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-[13px] font-medium text-[#1d1d1f]"
          >
            {label}
          </label>
          {showForgotPassword && (
            <button
              type="button"
              className="text-[12px] font-medium text-[#FCA311] hover:text-[#E89310] transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>
      )}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          className="w-full h-11 pl-11 pr-12 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FCA311]/10 focus:border-[#FCA311]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-slate-100 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
