import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export default function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Premium Backdrop blur */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content - Glassmorphism */}
      <div className={cn(
        "relative w-full max-w-lg glass-card border border-surfaceBorder shadow-2xl rounded-3xl transform transition-all animate-slide-up flex flex-col max-h-[75vh]",
        className
      )}>
        {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent" /> */}
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-surfaceBorder/50">
          <h3 className="text-xl font-bold text-tmain tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="text-tmuted hover:text-tmain hover:bg-surface p-2 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
