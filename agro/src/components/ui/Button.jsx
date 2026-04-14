import { cn } from "../../lib/utils";

export default function Button({ children, variant = "primary", className, ...props }) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-400 focus:ring-primary-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-primary-400/50",
    secondary: "bg-surface text-slate-200 border border-surfaceBorder hover:bg-slate-700 focus:ring-slate-500 shadow-lg",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    ghost: "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {variant === 'primary' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite] group-hover:block" />}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">{children}</span>
    </button>
  );
}
