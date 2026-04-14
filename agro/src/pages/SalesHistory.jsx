import { useState } from "react";
import { Search, MapPin, ExternalLink, Filter } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const salesData = [
    { id: "INV-2026-001", customer: "Ramesh Farmer", products: "2x Urea, 1x DAP", amount: "₹1,882", date: "Oct 24, 2026", time: "10:30 AM", stockDeducted: true },
    { id: "INV-2026-002", customer: "Suresh Singh", products: "5x Tomato Seeds", amount: "₹2,250", date: "Oct 23, 2026", time: "02:15 PM", stockDeducted: true },
    { id: "INV-2026-003", customer: "Mukesh Kumar", products: "10x Urea", amount: "₹2,660", date: "Oct 20, 2026", time: "11:45 AM", stockDeducted: true },
  ];

  const columns = ["Invoice ID", "Customer Details", "Products Sold", "Date & Time", "Total Amount", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 font-bold text-tmain tracking-widest text-xs uppercase">{item.id}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface text-tmain border border-surfaceBorder flex items-center justify-center font-bold text-xs shadow-sm">{item.customer.charAt(0)}</div>
          <span className="font-bold text-tmain block">{item.customer}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium">
        <div className="flex flex-col">
          <span>{item.products}</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-500 mt-1 font-bold">Stock Auto-Deducted</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="block text-tmuted font-bold">{item.date}</span>
        <span className="block text-tmuted/70 text-xs mt-0.5">{item.time}</span>
      </td>
      <td className="px-6 py-4 font-black text-emerald-500">{item.amount}</td>
      <td className="px-6 py-4">
        <button className="text-xs text-primary-500 font-bold hover:text-primary-600 flex items-center gap-1 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20 transition-all hover:bg-primary-500/20 dark:text-primary-400 dark:hover:text-primary-300">
          <ExternalLink size={14} /> View Receipt
        </button>
      </td>
    </>
  );

  const filteredSales = salesData.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter) {
      const [year, month, day] = dateFilter.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedFilterDate = `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
      matchesDate = item.date === formattedFilterDate;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Sales History</h1>
          <p className="text-sm text-tmuted mt-1">Review your past sales, generated invoices, and automatic stock deductions.</p>
        </div>
      </div>

      <div className="glass p-4 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
         <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Invoice ID or Customer..." 
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-tmuted focus:text-tmain transition-all cursor-pointer shadow-inner appearance-none min-h-[42px]"
            />
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={filteredSales} 
        keyExtractor={(item) => item.id}
        renderRow={renderRow} 
      />
    </div>
  );
}
