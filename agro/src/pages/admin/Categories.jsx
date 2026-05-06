import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Save, Layout, Check, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormInput from "../../components/ui/FormInput";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import DeleteModal from "../../components/ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, getCategory, createCategory, deleteCategory, changeCategoryStatus } from "../../redux/slices/categorySlice";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading: isFetching } = useSelector((state) => state.category);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: ""
  });

  const fetchCategoryData = async () => {
    dispatch(fetchCategories({
      page: 1,
      limit: 100,
      search: { name: searchQuery },
      sortfield: "_id",
      sortoption: 1
    }));
  };

  useEffect(() => {
    fetchCategoryData();
  }, [searchQuery]);

  const handleOpenModal = async (category = null) => {
    if (category) {
      try {
        const result = await dispatch(getCategory(category._id)).unwrap();
        const categoryData = result.Data;
        setEditingCategory(categoryData);
        setFormData({
          name: categoryData.name
        });
      } catch (err) {
        console.error("Failed to fetch category details:", err);
      }
    } else {
      setEditingCategory(null);
      setFormData({
        name: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        categoryid: editingCategory ? editingCategory._id : "",
        ...formData
      };
      const result = await dispatch(createCategory(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchCategoryData();
      }
    } catch (err) {
      console.error("Failed to save category:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteCategory(categoryToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchCategoryData();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(changeCategoryStatus(id)).unwrap();
      fetchCategoryData();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Product Categories</h1>
          <p className="text-sm text-tmuted mt-1">Manage categories to organize your product catalog.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <Table 
        columns={["Category Name", "Status", "Actions"]} 
        data={categories} 
        keyExtractor={(item) => item._id}
        renderRow={(category) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg border border-primary-500/20">
                  <Layout size={16} />
                </div>
                <span className="font-bold text-tmain text-sm">{category.name}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => handleToggleStatus(category._id)}
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
                  category.status 
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
              >
                {category.status ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(category)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(category)}
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
        title={editingCategory ? "Edit Category" : "Add New Category"}
        className="max-w-md"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput 
            label="Category Name" 
            placeholder="e.g. Pesticides" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />

          <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
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
