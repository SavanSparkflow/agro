import { Menu, Bell, Search, Sparkles, User, FileText, ArrowRight, ShoppingBag, AlertTriangle, UserPlus } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useState, useEffect, useRef } from "react";

export default function Topbar({ setMobileOpen }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mockResults = [
    { type: 'Customers', items: ['Suresh Patel', 'Mahesh Shah', 'Ramesh Kumar'] },
    { type: 'Transactions', items: ['INV-2024-001 - ₹15,000', 'INV-2024-002 - ₹8,500'] }
  ];

  return (
    <header className="h-20 lg:h-24 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all bg-background/60 backdrop-blur-xl border-b border-surfaceBorder shadow-sm">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-surfaceBorder text-tmuted hover:text-tmain hover:bg-surface/80 transition-colors shadow-lg"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar Container */}
        <div className="hidden sm:block relative">
          <div className={`flex items-center gap-3 px-4 py-2.5 glass-card !rounded-2xl border-surfaceBorder transition-all w-64 md:w-96 group shadow-sm ${isFocused ? 'ring-4 ring-primary-500/10 border-primary-500/50' : ''}`}>
            <Search size={18} className={`transition-colors ${isFocused ? 'text-form-primary' : 'text-tmuted'}`} />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search everything..." 
              className="bg-transparent border-none outline-none text-sm w-full text-tmain placeholder:text-tmuted font-medium"
            />
            <div className={`absolute right-3 hidden lg:flex items-center gap-1 transition-opacity duration-300 ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface/80 text-tmuted border border-surfaceBorder shadow-sm border-b-2">{isMac ? '⌘' : 'Ctrl'}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface/80 text-tmuted border border-surfaceBorder shadow-sm border-b-2">K</span>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {(isFocused && searchQuery.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-3 glass-card !rounded-2xl border-surfaceBorder shadow-2xl overflow-hidden animate-fade-in z-50 max-h-[400px] overflow-y-auto">
              <div className="p-2 space-y-4">
                {mockResults.map((category) => (
                  <div key={category.type}>
                    <h3 className="text-[10px] font-bold text-tmuted uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                       {category.type === 'Customers' ? <User size={12} /> : <FileText size={12} />}
                       {category.type}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <div key={item} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary-500/10 group cursor-pointer transition-all">
                          <span className="text-sm font-medium text-tmain group-hover:text-form-primary">{item}</span>
                          <ArrowRight size={14} className="text-tmuted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-surfaceBorder/50 mt-2 px-3 pb-2 text-center">
                   <p className="text-[10px] font-medium text-tmuted">Showing results for "<span className="text-form-primary font-bold">{searchQuery}</span>"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold mr-2 cursor-pointer hover:bg-primary-500/20 transition-colors">
          <Sparkles size={14} />
          <span>Pro Setup</span>
        </div>
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-10 h-10 flex items-center justify-center glass !rounded-xl transition-all shadow-lg group border-surfaceBorder ${showNotifications ? 'bg-surface ring-4 ring-primary-500/10' : 'text-tmuted hover:text-tmain'}`}
          >
            <Bell size={20} className={`${showNotifications ? 'text-form-primary' : 'group-hover:animate-[swing_1s_ease-in-out_infinite] origin-top'}`} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-surface animate-pulse-slow"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 glass-card !rounded-2xl border-surfaceBorder shadow-2xl overflow-hidden animate-fade-in z-50">
                <div className="p-4 border-b border-surfaceBorder/50 flex items-center justify-between bg-surface/30">
                  <h3 className="font-bold text-tmain flex items-center gap-2">
                    Notifications
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-black tracking-wider uppercase">3 New</span>
                  </h3>
                  <button className="text-[11px] font-bold text-form-primary hover:underline underline-offset-4 transition-all">Mark all as read</button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {/* Notification Items */}
                  <div className="divide-y divide-surfaceBorder/30">
                    <div className="p-4 hover:bg-primary-500/5 transition-all cursor-pointer group flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 shadow-sm border border-green-500/10">
                        <ShoppingBag size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-tmain group-hover:text-form-primary transition-colors">New order received!</p>
                        <p className="text-xs text-tmuted leading-relaxed">Order #ORD-8942 has been placed by Suresh Patel.</p>
                        <p className="text-[10px] font-medium text-tmuted/50 pt-1">2 minutes ago</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-form-primary shrink-0 mt-2" />
                    </div>

                    <div className="p-4 hover:bg-primary-500/5 transition-all cursor-pointer group flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-500/10">
                        <AlertTriangle size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-tmain group-hover:text-form-primary transition-colors">Low Stock Alert</p>
                        <p className="text-xs text-tmuted leading-relaxed">Pesticide A stock is critically low (under 10 units).</p>
                        <p className="text-[10px] font-medium text-tmuted/50 pt-1">1 hour ago</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-form-primary shrink-0 mt-2" />
                    </div>

                    <div className="p-4 hover:bg-primary-500/5 transition-all cursor-pointer group flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 shadow-sm border border-blue-500/10">
                        <UserPlus size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-tmain group-hover:text-form-primary transition-colors">New Dealer Joined</p>
                        <p className="text-xs text-tmuted leading-relaxed">Rajesh from Surat joined the Agro network.</p>
                        <p className="text-[10px] font-medium text-tmuted/50 pt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-surfaceBorder/50 text-center bg-surface/30 group cursor-pointer hover:bg-surface/50 transition-all">
                  <button className="text-xs font-bold text-tmuted group-hover:text-form-primary transition-colors flex items-center justify-center gap-2 mx-auto">
                    View all notifications
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
