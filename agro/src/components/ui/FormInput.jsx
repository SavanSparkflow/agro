import { cn } from "../../lib/utils";

export default function FormInput({ label, error, className, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input 
        className={cn(
          "form-control transition-all duration-200",
          error && "!border-red-500 !focus:border-red-500 focus:ring-red-500/10",
          props.disabled && "bg-surfaceBorder/20 text-tmuted/70 cursor-not-allowed opacity-70"
        )}
        {...props}
      />
      {error && <span className="text-[11px] font-medium text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}
