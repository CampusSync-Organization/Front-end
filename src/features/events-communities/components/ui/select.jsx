import { createContext, useContext, useState, useRef, useEffect } from "react";

const SelectContext = createContext(null);

export function Select({ value, onValueChange, children, ...props }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return (
    <div className="relative" ref={ref} {...props}>
      <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
}

export function SelectTrigger({ className = "", children, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.setOpen(!ctx?.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder = "Select..." }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx?.value || placeholder}</span>;
}

export function SelectContent({ className = "", children, ...props }) {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border border-border bg-card p-1 text-foreground shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, className = "", children, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <div
      role="option"
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-muted focus:bg-muted ${className}`}
      onClick={() => {
        ctx?.onValueChange?.(value);
        ctx?.setOpen?.(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}
