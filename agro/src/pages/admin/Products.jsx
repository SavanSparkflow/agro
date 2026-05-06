import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Save, ShoppingBag, Check, X, Upload, Image as ImageIcon, Filter } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormInput from "../../components/ui/FormInput";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import DeleteModal from "../../components/ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, getProduct, createProduct, deleteProduct, changeProductStatus, uploadProductImage } from "../../redux/slices/productSlice";
import { fetchCategoriesWOP } from "../../redux/slices/categorySlice";
import { fetchUnitsWOP } from "../../redux/slices/unitSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading: isFetching } = useSelector((state) => state.product);
  const { categoriesWOP: categories } = useSelector((state) => state.category);
  const { unitsWOP: units } = useSelector((state) => state.unit);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    categoryid: "",
    name: "",
    unit: "",
    price: "",
    image: "",
    description: ""
  });

  const fetchData = async () => {
    dispatch(fetchProducts({
      page: 1,
      limit: 50,
      search: { name: searchQuery },
      sortoption: -1
    }));
    dispatch(fetchCategoriesWOP(""));
    dispatch(fetchUnitsWOP(""));
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleOpenModal = async (product = null) => {
    if (product) {
      try {
        const result = await dispatch(getProduct(product._id)).unwrap();
        const productData = result.Data;
        setEditingProduct(productData);
        setFormData({
          categoryid: productData.categoryid?._id || productData.categoryid || "",
          name: productData.name,
          unit: productData.unit?._id || productData.unit || "",
          price: productData.price,
          image: productData.image,
          description: productData.description || ""
        });
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        categoryid: "",
        name: "",
        unit: "",
        price: "",
        image: "",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);
    setIsUploading(true);

    try {
      const result = await dispatch(uploadProductImage(uploadData)).unwrap();
      if (result.IsSuccess) {
        setFormData(prev => ({ ...prev, image: result.Data }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
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

  const handleToggleStatus = async (id) => {
    setChangingStatusId(id);
    try {
      const result = await dispatch(changeProductStatus(id)).unwrap();
      if (result.IsSuccess) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to change status:", err);
    } finally {
      setChangingStatusId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Product Catalog</h1>
          <p className="text-sm text-tmuted mt-1">Add and manage products, pricing, and stock specifications.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="text-xs h-9">
              <Filter size={14} />
              <span>Filters</span>
           </Button>
        </div>
      </div>

      <Table 
        columns={["Product", "Category", "Unit", "Price", "Status", "Actions"]} 
        data={products} 
        keyExtractor={(item) => item._id}
        renderRow={(product) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background border border-surfaceBorder flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag size={18} className="text-tmuted" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-tmain text-sm block">{product.name}</span>
                  <span className="text-[10px] text-tmuted uppercase tracking-wider line-clamp-1 max-w-[150px]">{product.description || "No description"}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-tmuted font-medium">
              {product.categoryid?.name || "Uncategorized"}
            </td>
            <td className="px-6 py-4">
              <span className="text-[10px] font-black bg-background border border-surfaceBorder px-2 py-1 rounded uppercase text-tmuted">
                {product.unit?.name || "Unit"}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-bold text-form-primary">₹{product.price}</span>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => handleToggleStatus(product._id)}
                disabled={changingStatusId === product._id}
                className={`relative group px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 min-w-[85px] justify-center ${
                  product.status 
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20'
                }`}
              >
                {changingStatusId === product._id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.status ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                )}
                {product.status ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(product)}
                  className="p-1.5 text-tmuted hover:text-red-400 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Edit Product" : "Add New Product"}
        className="max-w-3xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormInput 
                label="Product Name" 
                placeholder="e.g. Urea 50KG" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-background border border-surfaceBorder rounded-md text-sm outline-none focus:border-form-primary transition-all text-tmain"
                    value={formData.categoryid}
                    onChange={(e) => setFormData({ ...formData, categoryid: e.target.value })}
                    // required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Unit</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-background border border-surfaceBorder rounded-md text-sm outline-none focus:border-form-primary transition-all text-tmain"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    // required
                  >
                    <option value="">Select Unit</option>
                    {units.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <FormInput 
                label="Price (₹)" 
                type="number"
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Product Image</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="aspect-square w-full rounded-2xl border-2 border-dashed border-surfaceBorder bg-background flex flex-col items-center justify-center cursor-pointer hover:border-form-primary transition-all group overflow-hidden relative shadow-inner"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-form-primary" />
                    <span className="text-[10px] font-bold text-tmuted uppercase tracking-widest">Uploading...</span>
                  </div>
                ) : formData.image ? (
                  <>
                    <img src={formData.image} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload className="text-white w-8 h-8" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center text-tmuted group-hover:text-form-primary transition-colors">
                      <ImageIcon size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-tmain">Click to upload</p>
                      <p className="text-[10px] text-tmuted">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Description</label>
            <textarea 
              placeholder="Enter product description and specifications..."
              className="w-full px-4 py-3 bg-background border border-surfaceBorder rounded-md text-sm outline-none focus:border-form-primary transition-all text-tmain min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving || isUploading} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingProduct ? "Update Product" : "Create Product"}
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
