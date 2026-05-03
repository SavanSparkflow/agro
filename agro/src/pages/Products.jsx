import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter, ChevronDown, Shield } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";
import FormTextarea from "../components/ui/FormTextarea";
import DeleteModal from "../components/ui/DeleteModal";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const products = [
    { id: 1, name: "Urea Fertilizer", category: "Fertilizer", price: "₹266", stock: "In Stock", unit: "50kg bag", image: "https://images.unsplash.com/photo-1592982537447-6f2334f5aa0f?auto=format&fit=crop&q=80&w=100&h=100" },
    { id: 2, name: "DAP", category: "Fertilizer", price: "₹1,350", stock: "Low Stock", unit: "50kg bag", image: "https://images.unsplash.com/photo-1592982537447-6f2334f5aa0f?auto=format&fit=crop&q=80&w=100&h=100" },
    { id: 3, name: "Tomato Seeds", category: "Seeds", price: "₹450", stock: "Out of Stock", unit: "10g packet", image: "https://images.unsplash.com/photo-1592982537447-6f2334f5aa0f?auto=format&fit=crop&q=80&w=100&h=100" },
  ];

  const columns = ["Product", "Category", "Price", "Status", "Actions"];

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // API call logic would go here
    console.log("Deleting product:", productToDelete);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg object-cover bg-surface p-1 border border-surfaceBorder overflow-hidden shadow-sm">
            <img src={item.image} alt={item.name} className="w-full h-full rounded object-cover" />
          </div>
          <div>
            <span className="font-bold text-tmain block">{item.name}</span>
            <span className="text-[11px] font-medium text-tmuted/60 mt-0.5 block">{item.unit}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium text-sm">{item.category}</td>
      <td className="px-6 py-4 font-bold text-tmain text-sm">{item.price}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${
          item.stock === "In Stock" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
          item.stock === "Low Stock" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {item.stock}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all">
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDeleteClick(item)}
            className="p-1.5 text-tmuted hover:text-red-400 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Products</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
            <select className="w-full sm:w-48 pl-10 pr-10 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none appearance-none text-tmain shadow-sm transition-all hover:bg-surface/80 cursor-pointer">
              <option value="">All Categories</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizers">Fertilizers</option>
              <option value="pesticides">Pesticides</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={products} keyExtractor={(item) => item.id} renderRow={renderRow} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <FormInput label="Product Name" placeholder="e.g. Premium Urea" required />
          
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Category">
              <option>Fertilizer</option>
              <option>Seeds</option>
              <option>Pesticides</option>
            </FormSelect>
            <FormSelect label="Unit">
              <option>kg</option>
              <option>liter</option>
              <option>piece</option>
              <option>bag (50kg)</option>
            </FormSelect>
          </div>

          <FormInput label="Price (₹)" type="number" placeholder="0.00" required />
          
          <div className="space-y-1.5">
            <label className="form-label">Product Image</label>
            <input type="file" className="form-control file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-form-primary/10 file:text-form-primary hover:file:bg-form-primary/20 transition-all cursor-pointer p-[5px]" />
          </div>

          <FormTextarea label="Description" rows={3} placeholder="Product details..." />
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md px-4" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-md px-4">Save Product</Button>
          </div>
        </form>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        itemName={productToDelete?.name} 
      />
    </div>
  );
}
