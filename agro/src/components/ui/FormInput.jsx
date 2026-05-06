import { cn } from "../../lib/utils";

export default function FormInput({ label, error, className, rightElement, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative group">
        <input 
          className={cn(
            "form-control transition-all duration-200",
            rightElement && "pr-10",
            error && "!border-red-500 !focus:border-red-500 focus:ring-red-500/10",
            props.disabled && "bg-surfaceBorder/20 text-tmuted/70 cursor-not-allowed opacity-70"
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-[11px] font-medium text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}
