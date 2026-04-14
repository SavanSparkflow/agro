import { cn } from "../../lib/utils";

export default function FormCheckbox({ label, error, className, id, ...props }) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2.5">
        <input 
          id={checkboxId}
          type="checkbox"
          className="form-check-input"
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-[13px] font-medium text-tmuted cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </div>
  );
}
