import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
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
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  const ctx = useContext(DropdownContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: () => ctx?.setOpen(!ctx?.open) });
  }
  return (
    <button type="button" onClick={() => ctx?.setOpen(!ctx?.open)} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = "end", className = "", children, ...props }) {
  const ctx = useContext(DropdownContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 text-foreground shadow-md ${align === "end" ? "right-0" : "left-0"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className = "", children, ...props }) {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = "", ...props }) {
  return <div className={`-mx-1 my-1 h-px bg-border ${className}`} {...props} />;
}

export function DropdownMenuItem({ className = "", children, ...props }) {
  return (
    <div
      role="menuitem"
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:bg-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
