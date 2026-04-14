import { useState } from "react";
import { Search, Filter, Box, ChevronDown } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const ordersData = [
    { id: "ORD-9482", customer: "Ramesh Farmer", expectedDelivery: "Oct 28, 2026", total: "₹15,000", status: "pending", items: 4 },
    { id: "ORD-9481", customer: "Suresh Singh", expectedDelivery: "Oct 26, 2026", total: "₹8,450", status: "processing", items: 2 },
    { id: "ORD-9480", customer: "Mukesh Kumar", expectedDelivery: "Oct 22, 2026", total: "₹2,660", status: "complete", items: 10 },
    { id: "ORD-9479", customer: "Anil Dash", expectedDelivery: "Cancelled", total: "₹1,200", status: "reject", items: 1 },
  ];

  const columns = ["Order ID", "Customer", "Items", "Expected Delivery", "Total Value", "Order Status"];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'complete': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'reject': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-surface text-theme-muted border-surfaceBorder';
    }
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 font-bold text-tmain tracking-widest text-xs">{item.id}</td>
      <td className="px-6 py-4 font-bold text-tmain">{item.customer}</td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2 text-tmuted font-medium">
          <Box size={14} className="text-tmuted/50" /> {item.items} Products
        </span>
      </td>
      <td className="px-6 py-4 text-tmuted/70 font-medium">{item.expectedDelivery}</td>
      <td className="px-6 py-4 font-black text-tmain">{item.total}</td>
      <td className="px-6 py-4">
        {/* Interactive Status Dropdown for Order Management */}
        <select 
          defaultValue={item.status}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none text-center ${getStatusStyle(item.status)} focus:ring-1 focus:ring-primary-500/50 transition-all`}
        >
          <option value="pending" className="bg-surface text-amber-500">Pending</option>
          <option value="processing" className="bg-surface text-blue-500">Processing</option>
          <option value="complete" className="bg-surface text-emerald-500">Complete</option>
          <option value="reject" className="bg-surface text-red-500">Reject</option>
        </select>
      </td>
    </>
  );

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Orders</h1>
        </div>
      </div>

      <div className="glass p-4 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
         <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-primary-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-56 pl-11 pr-10 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none text-tmain shadow-inner transition-all hover:bg-surface/80 cursor-pointer"
            >
              <option value="" className="bg-surface text-tmain font-medium">All Statuses</option>
              <option value="pending" className="bg-surface text-amber-500 font-medium">Pending</option>
              <option value="processing" className="bg-surface text-blue-500 font-medium">Processing</option>
              <option value="complete" className="bg-surface text-emerald-500 font-medium">Complete</option>
              <option value="reject" className="bg-surface text-red-500 font-medium">Reject</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={filteredOrders} 
        keyExtractor={(item) => item.id}
        renderRow={renderRow} 
      />
    </div>
  );
}
