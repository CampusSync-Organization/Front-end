export function Table({ className = "", ...props }) {
  return <table className={`w-full caption-bottom text-sm ${className}`} {...props} />;
}

export function TableHeader({ ...props }) {
  return <thead {...props} />;
}

export function TableBody({ ...props }) {
  return <tbody {...props} />;
}

export function TableRow({ className = "", ...props }) {
  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
      {...props}
    />
  );
}

export function TableHead({ className = "", ...props }) {
  return (
    <th
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }) {
  return (
    <td
      className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}
