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

import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, getCategory, createCategory, deleteCategory } from "../redux/slices/categorySlice";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [formName, setFormName] = useState("");

  const fetchData = async () => {
    dispatch(fetchCategories({
      page: 1,
      limit: 100,
      search: searchTerm ? { name: searchTerm } : {},
      sortoption: -1
    }));
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setIsModalOpen(true);
  };

  const handleEditClick = async (cat) => {
    try {
      const result = await dispatch(getCategory(cat._id)).unwrap();
      const catData = result.Data;
      setEditingCategory(catData);
      setFormName(catData.name || "");
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch category details:", err);
    }
  };

  const handleViewProducts = (cat) => {
    setSelectedCategory(cat);
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteCategory(categoryToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        categoryid: editingCategory ? editingCategory._id : "",
        name: formName
      };
      const result = await dispatch(createCategory(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save category:", err);
    } finally {
      setIsSaving(false);
    }
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
          columns={["Category Name", "Actions"]} 
          data={categories} 
          keyExtractor={(item) => item._id}
          renderRow={(item) => (
            <>
              <td className="px-6 py-4">
                <span className="font-bold text-tmain text-sm">{item.name}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
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
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden mt-4">
        {categories.map((item) => (
          <Card key={item._id} className="p-4 border-surfaceBorder hover:border-primary-500/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-surfaceBorder bg-surface">
                <Layers size={24} className="text-tmuted" />
              </div>
              <div>
                <h3 className="font-bold text-tmain">{item.name}</h3>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => handleEditClick(item)} className="p-2 text-tmuted hover:text-form-primary"><Edit2 size={18} /></button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit Product Category" : "Create Product Category"}>
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
            <Button type="submit" disabled={isSaving} className="rounded-md px-8">
              {isSaving ? "Saving..." : editingCategory ? "Update Details" : "Deploy Category"}
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
