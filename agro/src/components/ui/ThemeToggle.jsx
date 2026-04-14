import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl bg-surface border border-surfaceBorder text-tmain hover:bg-primary-500/10 hover:border-primary-500/30 transition-all duration-300 shadow-lg ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-amber-400 animate-pulse-slow" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  );
}
