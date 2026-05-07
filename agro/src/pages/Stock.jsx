import { useState, useEffect } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";

export default function Stock() {
  const dispatch = useDispatch();
  const { products, totalRecords, loading } = useSelector((state) => state.product);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    dispatch(fetchProducts({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm ? { name: searchTerm } : "",
      sortoption: -1
    }));
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stockData = products.map(p => ({
    id: p._id,
    name: p.name,
    stock: p.stock || 0,
    unit: p.unit?.name || p.unitid?.name || "N/A",
    status: (p.stock || 0) === 0 ? "Out of Stock" : (p.stock || 0) < 20 ? "Low Stock" : "In Stock"
  }));

  const columns = ["Product Name", "Available Stock", "Unit", "Status"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 font-bold text-tmain tracking-wide">{item.name}</td>
      <td className="px-6 py-4">
        <span className={`font-black text-lg ${
          item.stock === 0 ? "text-red-400" :
          item.stock < 20 ? "text-amber-400" :
          "text-green-500"
        }`}>
          {item.stock}
        </span>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium">{item.unit}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
          item.status === "In Stock" ? "bg-green-500/10 text-green-500 border-green-500/20" :
          item.status === "Low Stock" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {(item.status === "Low Stock" || item.status === "Out of Stock") && <AlertCircle size={14} />}
          {item.status}
        </span>
      </td>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Stock</h1>
        </div>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search stock..." 
            className="w-full pl-11 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-tmuted bg-background/50 px-4 py-2 rounded-lg border border-surfaceBorder/30 shadow-inner">
          <span className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> 
            Out of stock ({stockData.filter(i => i.status === "Out of Stock").length})
          </span>
          <span className="flex items-center gap-2 ml-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> 
            Low stock ({stockData.filter(i => i.status === "Low Stock").length})
          </span>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={stockData} 
        keyExtractor={(item) => item.id} 
        renderRow={renderRow} 
        isLoading={loading}
      />

      <Pagination 
        currentPage={currentPage}
        totalRecords={totalRecords}
        limit={itemsPerPage}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Stock">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <FormSelect label="Select Product">
            {stockData.map(item => <option key={item.id}>{item.name}</option>)}
          </FormSelect>
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Quantity to Add" type="number" placeholder="0" required />
            <FormInput label="Date Received" type="date" required />
          </div>
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-md">Update Stock</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
