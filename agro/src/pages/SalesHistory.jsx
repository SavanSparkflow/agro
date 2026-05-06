import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import Table from "../components/ui/Table";

export default function SalesHistory() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchData = async () => {
    dispatch(fetchOrders({
      page: 1,
      limit: 100,
      search: searchTerm ? { orderno: searchTerm } : {},
      distributorid: [],
      customerid: [],
      orderno: [],
      deliverydate: [],
      totalamount: [],
      sortoption: -1
    }));
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const columns = ["Invoice ID", "Customer Details", "Products Sold", "Date & Time", "Total Amount", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 font-bold text-tmain tracking-widest text-xs uppercase">{item.orderno}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface text-tmain border border-surfaceBorder flex items-center justify-center font-bold text-xs shadow-sm">
            {item.customerid?.name?.charAt(0) || "C"}
          </div>
          <span className="font-bold text-tmain block">{item.customerid?.name || "N/A"}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium">
        <div className="flex flex-col">
          <span>{item.items?.length || 0} Items</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-500 mt-1 font-bold">Stock Auto-Deducted</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="block text-tmuted font-bold">{item.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy") : "N/A"}</span>
        <span className="block text-tmuted/70 text-xs mt-0.5">{item.createdAt ? format(new Date(item.createdAt), "hh:mm a") : ""}</span>
      </td>
      <td className="px-6 py-4 font-black text-emerald-500">₹{item.totalamount?.toLocaleString()}</td>
      <td className="px-6 py-4">
        <button className="text-xs text-primary-500 font-bold hover:text-primary-600 flex items-center gap-1 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20 transition-all hover:bg-primary-500/20 dark:text-primary-400 dark:hover:text-primary-300">
          <ExternalLink size={14} /> View Receipt
        </button>
      </td>
    </>
  );

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
        data={orders} 
        keyExtractor={(item) => item._id}
        renderRow={renderRow} 
        isLoading={loading}
      />
    </div>
  );
}
