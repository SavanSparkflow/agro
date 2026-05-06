import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter, ChevronDown, Shield } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";
import FormTextarea from "../components/ui/FormTextarea";
import DeleteModal from "../components/ui/DeleteModal";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, getProduct, createProduct, deleteProduct } from "../redux/slices/productSlice";
import { fetchCategoriesWOP } from "../redux/slices/categorySlice";
import { fetchUnitsWOP } from "../redux/slices/unitSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { categoriesWOP } = useSelector((state) => state.category);
  const { unitsWOP } = useSelector((state) => state.unit);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryid: "",
    unitid: "",
    price: "",
    description: ""
  });

  const fetchData = async () => {
    dispatch(fetchProducts({
      page: 1,
      limit: 10,
      search: searchTerm ? { name: searchTerm } : {},
      categoryid: [],
      unitid: [],
      price: [],
      sortoption: -1
    }));
  };

  useEffect(() => {
    fetchData();
    dispatch(fetchCategoriesWOP(""));
    dispatch(fetchUnitsWOP(""));
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryid: "",
      unitid: "",
      price: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleEditClick = async (product) => {
    try {
      const result = await dispatch(getProduct(product._id)).unwrap();
      const pData = result.Data;
      setEditingProduct(pData);
      setFormData({
        name: pData.name || "",
        categoryid: pData.categoryid?._id || pData.categoryid || "",
        unitid: pData.unitid?._id || pData.unitid || "",
        price: pData.price || "",
        description: pData.description || ""
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch product details:", err);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        productid: editingProduct ? editingProduct._id : "",
        ...formData
      };
      const result = await dispatch(createProduct(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = ["Product", "Category", "Price", "Status", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg object-cover bg-surface p-1 border border-surfaceBorder overflow-hidden shadow-sm">
            <img src={item.image || "https://images.unsplash.com/photo-1592982537447-6f2334f5aa0f?auto=format&fit=crop&q=80&w=100&h=100"} alt={item.name} className="w-full h-full rounded object-cover" />
          </div>
          <div>
            <span className="font-bold text-tmain block">{item.name}</span>
            <span className="text-[11px] font-medium text-tmuted/60 mt-0.5 block">{item.unitid?.name || "N/A"}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium text-sm">{item.categoryid?.name || "N/A"}</td>
      <td className="px-6 py-4 font-bold text-tmain text-sm">₹{item.price?.toLocaleString()}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${
          (item.stock || 0) > 20 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
          (item.stock || 0) > 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {(item.stock || 0) === 0 ? "Out of Stock" : (item.stock || 0) < 20 ? "Low Stock" : "In Stock"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEditClick(item)}
            className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
          >
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
        <Button onClick={handleOpenAddModal} className="rounded-md px-6 py-2">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} data={products} keyExtractor={(item) => item._id} renderRow={renderRow} isLoading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput 
            label="Product Name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Premium Urea" 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label="Category" 
              name="categoryid"
              value={formData.categoryid}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categoriesWOP.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </FormSelect>
            <FormSelect 
              label="Unit" 
              name="unitid"
              value={formData.unitid}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Unit</option>
              {unitsWOP.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </FormSelect>
          </div>

          <FormInput 
            label="Price (₹)" 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00" 
            required 
          />
          
          <FormTextarea 
            label="Description" 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3} 
            placeholder="Product details..." 
          />
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md px-4" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-4">
              {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
            </Button>
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
