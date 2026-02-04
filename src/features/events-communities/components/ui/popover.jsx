import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const PopoverContext = createContext(null);

export function Popover({ children }) {
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
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative" ref={ref}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children, ...props }) {
  const ctx = useContext(PopoverContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: () => ctx?.setOpen(!ctx?.open) });
  }
  return (
    <button type="button" onClick={() => ctx?.setOpen(!ctx?.open)} {...props}>
      {children}
    </button>
  );
}

export function PopoverContent({ className = "", align = "start", children, ...props }) {
  const ctx = useContext(PopoverContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 w-auto rounded-md border border-border bg-card p-0 shadow-md ${align === "start" ? "left-0" : "left-1/2 -translate-x-1/2"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
