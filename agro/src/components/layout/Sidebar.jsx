import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCircle, Box, Tags, Archive,
  ReceiptIndianRupee, ChevronLeft, ChevronRight, MessageSquare, Shield, Clock, ShoppingCart
} from "lucide-react";
import { cn } from "../../lib/utils";

const DEALER_LINKS = [
  { name: "Dashboard", href: "/dealer", icon: LayoutDashboard },
  { name: "Products", href: "/dealer/products", icon: Box },
  { name: "Categories", href: "/dealer/categories", icon: Tags },
  { name: "Stock", href: "/dealer/stock", icon: Archive },
  { name: "Customers", href: "/dealer/customers", icon: UserCircle },
  { name: "Orders", href: "/dealer/orders", icon: ShoppingCart },
  { name: "Billing", href: "/dealer/billing", icon: ReceiptIndianRupee },
  { name: "Sales History", href: "/dealer/history", icon: Clock },
];

const ADMIN_LINKS = [
  { name: "Dealers List", href: "/admin/dealers", icon: Shield },
  { name: "User List", href: "/admin/users", icon: Users },
  { name: "Permissions", href: "/admin/permissions", icon: Shield },
];

export default function Sidebar({ isOpen, toggleSidebar, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={cn(
        "fixed z-50 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-surface/90 backdrop-blur-md border-r border-surfaceBorder",
        isOpen ? "w-72" : "w-20",
        "top-0 left-0 h-screen",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col relative overflow-hidden group/sidebar">

          {/* Logo Area */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-surfaceBorder shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-xl uppercase tracking-wider">A</span>
              </div>
              <div className={cn("transition-all duration-300", isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute ml-12")}>
                <span className="font-bold text-lg text-tmain whitespace-nowrap block">Agro</span>
                <span className="text-xs text-primary-400 font-medium tracking-widest uppercase">ERP System</span>
              </div>
            </div>
            {/* Desktop Toggle Button */}
            {isOpen && (
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex w-8 h-8 rounded-full hover:bg-surface/80 items-center justify-center text-tmuted hover:text-tmain transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            {/* Admin Links Section */}
            {isOpen && <div className="px-2 mb-4 text-[10px] font-bold text-tmuted uppercase tracking-widest">Administrator Access</div>}
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-rose-500/10 text-rose-400"
                      : "text-tmuted hover:bg-surface/50 hover:text-tmain"
                  )}
                  title={!isOpen ? link.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-md shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                      )}
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-xl transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] text-rose-400" : ""} />
                      </div>
                      <span className={cn(
                        "font-medium text-sm transition-all duration-300",
                        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute ml-12"
                      )}>
                        {link.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {isOpen && <div className="px-2 mt-8 mb-4 text-[10px] font-bold text-tmuted uppercase tracking-widest border-t border-surfaceBorder pt-6">Main Menu</div>}

            {DEALER_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.href}
                  end={link.href === '/' || link.href === '/dealer'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary-500/10 text-primary-400"
                      : "text-tmuted hover:bg-surface/50 hover:text-tmain"
                  )}
                  title={!isOpen ? link.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-md shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                      )}

                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-xl transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""} />
                      </div>

                      <span className={cn(
                        "font-medium text-sm transition-all duration-300",
                        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute ml-12"
                      )}>
                        {link.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>

          {/* User Profile Footer */}
          <Link to="/profile" className="p-4 border-t border-surfaceBorder shrink-0 bg-surface/30 hover:bg-surface/80 transition-colors group cursor-pointer block">
            <div className={cn("flex items-center gap-3 transition-all duration-300", isOpen ? "px-2" : "justify-center")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-surface/80 to-surface/40 p-[2px] shrink-0 group-hover:from-primary-500 group-hover:to-primary-600 transition-colors border border-surfaceBorder">
                <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center overflow-hidden">
                  <UserCircle className="text-tmuted w-full h-full p-1 opacity-80 group-hover:text-tmain" />
                </div>
              </div>
              <div className={cn("flex flex-col transition-all duration-300", isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 absolute")}>
                <span className="text-sm font-semibold text-tmain truncate group-hover:text-primary-400">Ramesh Kumar</span>
                <span className="text-xs text-tmuted truncate">Dealer Account</span>
              </div>
            </div>
          </Link>

          {!isOpen && (
            <div className="px-4 pb-4 bg-surface/30">
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex w-full h-10 rounded-xl hover:bg-surface/80 items-center justify-center text-tmuted hover:text-tmain transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
