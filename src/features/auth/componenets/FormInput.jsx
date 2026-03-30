export default function FormInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  icon: Icon,
  required = false,
  autoComplete,
  className = "",
  inputClassName = "",
}) {
  return (
    <div className={`form-field space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-[#1d1d1f]"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full h-11 ${Icon ? "pl-11 pr-4" : "px-4"} rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FCA311]/10 focus:border-[#FCA311] ${inputClassName}`}
        />
      </div>
    </div>
  );
}
