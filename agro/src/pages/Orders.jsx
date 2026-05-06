import { useState, useEffect } from "react";
import { Search, Filter, Box, ChevronDown, Loader2, Calendar, IndianRupee, Hash, User, Trash2 } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, changeOrderStatus, deleteOrder } from "../redux/slices/orderSlice";
import { format } from "date-fns";

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading: isFetching } = useSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async () => {
    dispatch(fetchOrders({
      page: 1,
      limit: 50,
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

  const handleStatusChange = async (orderid, newStatus) => {
    try {
      const result = await dispatch(changeOrderStatus({ orderid, status: newStatus })).unwrap();
      if (result.IsSuccess) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  const handleDelete = async (orderid) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const result = await dispatch(deleteOrder(orderid)).unwrap();
        if (result.IsSuccess) {
          fetchData();
        }
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'complete': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'reject': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-surface text-theme-muted border-surfaceBorder';
    }
  };

  const columns = ["Order Details", "Customer", "Items", "Delivery Date", "Amount", "Status", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-500/10 text-primary-500 rounded-lg">
            <Hash size={14} />
          </div>
          <span className="font-bold text-tmain tracking-widest text-xs uppercase">{item.orderno || item._id?.slice(-8)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center">
              <User size={14} className="text-tmuted" />
           </div>
           <span className="font-bold text-tmain text-sm">{item.customerid?.name || "Unknown Customer"}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2 text-tmuted font-medium text-xs">
          <Box size={14} className="text-tmuted/50" /> {item.items?.length || 0} Products
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-tmuted/70 font-medium text-xs">
          <Calendar size={14} className="opacity-50" />
          {item.deliverydate ? format(new Date(item.deliverydate), "MMM dd, yyyy") : "N/A"}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 font-black text-form-primary">
          <IndianRupee size={14} />
          <span>{item.totalamount?.toLocaleString() || "0"}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative group/select">
          <select 
            value={item.status}
            onChange={(e) => handleStatusChange(item._id, e.target.value)}
            className={`pl-3 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase border outline-none cursor-pointer appearance-none text-center transition-all ${getStatusStyle(item.status)} hover:shadow-md focus:ring-2 focus:ring-primary-500/20`}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="reject">Reject</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </td>
      <td className="px-6 py-4">
         <button 
           onClick={() => handleDelete(item._id)}
           className="p-2 text-tmuted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
           title="Delete Order"
         >
            <Trash2 size={16} />
         </button>
      </td>
    </>
  );

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "" || order.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Order Management</h1>
          <p className="text-sm text-tmuted mt-1 tracking-wide">Track and manage customer orders and delivery status.</p>
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-md p-4 border border-surfaceBorder rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
         <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
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
              className="w-full sm:w-56 pl-11 pr-10 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-form-primary outline-none appearance-none text-tmain shadow-inner transition-all hover:bg-surface/80 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="complete">Complete</option>
              <option value="reject">Reject</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-form-primary" />
          </div>
        )}
        <Table 
          columns={columns} 
          data={filteredOrders} 
          keyExtractor={(item) => item._id}
          renderRow={renderRow} 
        />
      </div>
    </div>
  );
}
