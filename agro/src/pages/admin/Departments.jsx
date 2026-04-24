import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Save, Layout, Image as ImageIcon, Link as LinkIcon, ListOrdered, ChevronRight, Check, X, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormInput from "../../components/ui/FormInput";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import { 
  useGetDepartmentsMutation, 
  useCreateOrUpdateDepartmentMutation, 
  useDeleteDepartmentMutation, 
  useChangeDepartmentStatusMutation,
  useUploadIconMutation
} from "../../redux/api/departmentApi";

const slugify = (text) => {
  return "/" + text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDept, setEditingDept] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    path: "",
    icon: "",
    hovericon: "",
    order: 0,
    parentid: "",
    type: "department"
  });

  const [getDepartments, { isLoading: isFetching }] = useGetDepartmentsMutation();
  const [createOrUpdateDept, { isLoading: isSaving }] = useCreateOrUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();
  const [changeStatus] = useChangeDepartmentStatusMutation();
  const [uploadIcon, { isLoading: isUploading }] = useUploadIconMutation();

  const iconInputRef = useRef(null);
  const hoverIconInputRef = useRef(null);
  const [uploadingField, setUploadingField] = useState(null);

  const fetchDepartments = async () => {
    try {
      const result = await getDepartments({
        page: 1,
        limit: 100,
        search: searchQuery,
        sortfield: "order",
        sortoption: 1
      }).unwrap();
      if (result.IsSuccess) {
        setDepartments(result.Data.docs || []);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [searchQuery]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      path: editingDept ? prev.path : slugify(name)
    }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    setUploadingField(field);

    try {
      const result = await uploadIcon(formDataUpload).unwrap();
      if (result.IsSuccess) {
        setFormData(prev => ({ ...prev, [field]: result.Data }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingField(null);
    }
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        path: dept.path,
        icon: dept.icon,
        hovericon: dept.hovericon,
        order: dept.order || 0,
        parentid: dept.parentid || "",
        type: dept.type || "department"
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: "",
        path: "",
        icon: "",
        hovericon: "",
        order: departments.length + 1,
        parentid: "",
        type: "department"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        departid: editingDept ? editingDept._id : "",
        ...formData
      };
      const result = await createOrUpdateDept(payload).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchDepartments();
      }
    } catch (err) {
      console.error("Failed to save department:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDept({ departid: id }).unwrap();
        fetchDepartments();
      } catch (err) {
        console.error("Failed to delete department:", err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await changeStatus({ departid: id }).unwrap();
      fetchDepartments();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Department Management</h1>
          <p className="text-sm text-tmuted mt-1">Manage system modules, their icons, navigation paths, and display order.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Department</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <Table 
        columns={["Order", "Module Name", "Path", "Icons", "Status", "Actions"]} 
        data={departments} 
        keyExtractor={(item) => item._id}
        renderRow={(dept) => (
          <>
            <td className="px-6 py-4">
              <span className="text-xs font-bold text-tmuted">#{dept.order}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg border border-primary-500/20">
                  <Layout size={16} />
                </div>
                <div>
                  <span className="font-bold text-tmain text-sm">{dept.name}</span>
                  {dept.parentid && (
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-tmuted uppercase font-black">
                      <ChevronRight size={10} /> Sub-module
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <code className="text-[11px] bg-background px-2 py-0.5 rounded border border-surfaceBorder text-tmuted">{dept.path}</code>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                {dept.icon && <img src={dept.icon} alt="icon" className="w-8 h-8 object-contain rounded bg-background p-1 border border-surfaceBorder shadow-sm" />}
                {dept.hovericon && <img src={dept.hovericon} alt="hover" className="w-8 h-8 object-contain rounded bg-background p-1 border border-surfaceBorder shadow-sm" />}
                {!dept.icon && !dept.hovericon && <span className="text-[10px] text-tmuted italic">No icons</span>}
              </div>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => handleToggleStatus(dept._id)}
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
                  dept.status 
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
              >
                {dept.status ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(dept)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(dept._id)}
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
        title={editingDept ? "Edit Department" : "Add New Department"}
        className="max-w-3xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Department Name" 
              placeholder="e.g. Inventory" 
              value={formData.name}
              onChange={handleNameChange}
              required 
            />
            <FormInput 
              label="Navigation Path" 
              placeholder="e.g. /inventory" 
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Icon Image</label>
              <div className="flex items-center gap-4 p-4 bg-background border-2 border-dashed border-surfaceBorder rounded-xl hover:border-form-primary/50 transition-colors group relative overflow-hidden">
                <input 
                  type="file" 
                  ref={iconInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "icon")}
                />
                <div 
                  onClick={() => iconInputRef.current.click()}
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-surfaceBorder text-tmuted group-hover:text-form-primary cursor-pointer transition-all shadow-sm overflow-hidden"
                >
                  {uploadingField === "icon" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : formData.icon ? (
                    <img src={formData.icon} className="w-full h-full object-contain" alt="Icon" />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-tmain">Upload Icon</p>
                  <p className="text-[10px] text-tmuted">PNG, SVG or JPG (Max 50MB)</p>
                </div>
                {formData.icon && (
                  <button type="button" onClick={() => setFormData({...formData, icon: ""})} className="p-1.5 text-tmuted hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Hover Icon Image</label>
              <div className="flex items-center gap-4 p-4 bg-background border-2 border-dashed border-surfaceBorder rounded-xl hover:border-form-primary/50 transition-colors group relative overflow-hidden">
                <input 
                  type="file" 
                  ref={hoverIconInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "hovericon")}
                />
                <div 
                  onClick={() => hoverIconInputRef.current.click()}
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-surfaceBorder text-tmuted group-hover:text-form-primary cursor-pointer transition-all shadow-sm overflow-hidden"
                >
                  {uploadingField === "hovericon" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : formData.hovericon ? (
                    <img src={formData.hovericon} className="w-full h-full object-contain" alt="Hover Icon" />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-tmain">Upload Hover Icon</p>
                  <p className="text-[10px] text-tmuted">Usually a colored version</p>
                </div>
                {formData.hovericon && (
                  <button type="button" onClick={() => setFormData({...formData, hovericon: ""})} className="p-1.5 text-tmuted hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">Parent Department</label>
              <select 
                className="w-full px-4 py-2.5 bg-surface border border-surfaceBorder rounded-md text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain transition-all"
                value={formData.parentid}
                onChange={(e) => setFormData({ ...formData, parentid: e.target.value })}
              >
                <option value="">None (Top Level)</option>
                {departments.filter(d => d._id !== editingDept?._id).map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <FormInput 
              label="Display Order" 
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              required 
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingDept ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
