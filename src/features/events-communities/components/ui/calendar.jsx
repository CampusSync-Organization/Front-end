import { useState } from "react";

function toYMD(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Calendar({ mode = "single", selected, onSelect, disabled, className = "" }) {
  const [value, setValue] = useState(toYMD(selected));
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    if (v) onSelect?.(new Date(v + "T12:00:00"));
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = disabled ? toYMD(today) : undefined;
  return (
    <div className={`rounded-md border border-border p-3 ${className}`}>
      <input
        type="date"
        value={selected ? toYMD(selected) : value}
        onChange={handleChange}
        min={min}
        className="w-full rounded border border-border bg-input px-3 py-2 text-sm"
      />
    </div>
  );
}
