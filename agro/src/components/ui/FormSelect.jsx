import { cn } from "../../lib/utils";

export default function FormSelect({ label, error, children, className, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <select 
        className={cn(
          "form-select transition-all duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          props.disabled && "bg-surfaceBorder/20 text-tmuted/70 cursor-not-allowed opacity-70"
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-[11px] font-medium text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}
