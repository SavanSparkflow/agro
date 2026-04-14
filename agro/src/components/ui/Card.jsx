import { cn } from "../../lib/utils";

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn("glass-card rounded-3xl p-6", className)} {...props}>
      {children}
    </div>
  );
}
