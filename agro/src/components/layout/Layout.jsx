import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "../../lib/utils";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto close sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary-500/30">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={cn(
        "flex-1 min-w-0 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-screen",
        isOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        <Topbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden animate-fade-in relative z-10 w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
