import { useNavigate } from "react-router-dom";
import { Plus, Tag, Edit2, Trash2, Box, Droplet, Archive, ArrowRight, Boxes, Layers, Search, Eye } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import DeleteModal from "../components/ui/DeleteModal";
import { cn } from "../lib/utils";
import { useState } from "react";

import Table from "../components/ui/Table";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formName, setFormName] = useState("");

  const categories = [
    { id: 1, name: "Fertilizers", count: 45, icon: Droplet },
    { id: 2, name: "Seeds", count: 120, icon: Tag },
    { id: 3, name: "Pesticides", count: 32, icon: Box },
    { id: 4, name: "Tools", count: 15, icon: Archive },
  ];

  const mockProducts = {
    1: [
      { id: 101, name: "Urea Premium 50kg", price: "₹299", stock: "450 Bags" },
      { id: 102, name: "NPK 19:19:19", price: "₹450", stock: "125 Units" },
      { id: 103, name: "Potash Supreme", price: "₹580", stock: "80 Bags" },
    ],
    2: [
      { id: 201, name: "Golden Hybrid Wheat", price: "₹1,200", stock: "2,500 kg" },
      { id: 202, name: "Basmati Paddy Seeds", price: "₹2,500", stock: "1,200 kg" },
    ],
    3: [
      { id: 301, name: "Bio-Shield 500ml", price: "₹850", stock: "45 Bottles" },
    ],
    4: [
      { id: 401, name: "Steel Garden Spade", price: "₹450", stock: "12 Units" },
      { id: 402, name: "Electric Sprayer", price: "₹3,200", stock: "5 Units" },
    ]
  };

  const navigate = useNavigate();

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormName("");
    setIsModalOpen(true);
  };

  const handleEditClick = (cat) => {
    setIsEditMode(true);
    setFormName(cat.name);
    setIsModalOpen(true);
  };

  const handleViewProducts = (cat) => {
    setSelectedCategory(cat);
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting category:", categoryToDelete);
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? "Updating category" : "Creating category", { formName });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Refined Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Product Categories</h1>
        </div>
        <Button onClick={handleOpenAddModal} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <Table 
          columns={["Category Name", "Total Products", "Actions"]} 
          data={categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))} 
          keyExtractor={(item) => item.id}
          renderRow={(item) => (
            <>
              <td className="px-6 py-4">
                <span className="font-bold text-tmain text-sm">{item.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-[11px] font-black text-tmuted uppercase tracking-widest bg-background px-2 py-1 rounded border border-surfaceBorder">
                  {item.count} Products
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleViewProducts(item); }}
                    className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                    title="View Catalog"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                    className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                    title="Edit Category"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                    className="p-1.5 text-tmuted hover:text-red-400 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </>
          )} 
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden mt-4">
        {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
          <Card key={item.id} className="p-4 border-surfaceBorder hover:border-primary-500/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-surfaceBorder bg-surface">
                <item.icon size={24} className="text-tmuted" />
              </div>
              <div>
                <h3 className="font-bold text-tmain">{item.name}</h3>
                <p className="text-[10px] font-bold text-tmuted uppercase">{item.count} Products</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleViewProducts(item)} className="p-2 text-primary-500"><ArrowRight size={18} /></button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Product Category" : "Create Product Category"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput 
            label="Category Name" 
            placeholder="e.g. Premium Pesticides" 
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required 
          />

          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-md px-8">
              {isEditMode ? "Update Details" : "Deploy Category"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={selectedCategory ? `${selectedCategory.name} Catalog` : "Product List"}
        className="max-w-2xl"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {(mockProducts[selectedCategory?.id] || []).map((product) => (
              <div key={product.id} className="p-3 bg-surface border border-transparent hover:border-surfaceBorder rounded-xl flex items-center justify-between group transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center text-tmuted group-hover:text-form-primary transition-all border border-surfaceBorder shadow-inner">
                    <Boxes size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-tmain leading-tight tracking-tight">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-tmuted font-medium italic opacity-70">
                      <span className="flex items-center gap-1"><Layers size={11} /> Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
          {(!mockProducts[selectedCategory?.id] || mockProducts[selectedCategory?.id].length === 0) && (
            <div className="text-center py-8">
              <Boxes size={32} className="mx-auto text-tmuted/20 mb-2" />
              <p className="text-xs text-tmuted font-medium italic">No products currently listed in this category.</p>
            </div>
          )}
        </div>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}
