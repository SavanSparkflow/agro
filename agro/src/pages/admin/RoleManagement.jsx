import { useState, useEffect } from "react";
import { Shield, Plus, Edit2, Trash2, Search, Loader2, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import FormInput from "../../components/ui/FormInput";
import DeleteModal from "../../components/ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, getRole, createRole, deleteRole, changeRoleStatus } from "../../redux/slices/roleSlice";

export default function RoleManagement() {
  const dispatch = useDispatch();
  const { roles, loading: isFetching } = useSelector((state) => state.role);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    rolename: ""
  });

  const fetchData = async () => {
    dispatch(fetchRoles({
      page: 1,
      limit: 50,
      search: { rolename: searchQuery },
      sortfield: "_id",
      sortoption: 1
    }));
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleOpenModal = async (role = null) => {
    if (role) {
      try {
        const result = await dispatch(getRole(role._id)).unwrap();
        const roleData = result.Data;
        setEditingRole(roleData);
        setFormData({
          rolename: roleData.rolename
        });
      } catch (err) {
        console.error("Failed to fetch role details:", err);
      }
    } else {
      setEditingRole(null);
      setFormData({
        rolename: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        roleid: editingRole ? editingRole._id : "",
        ...formData
      };
      const result = await dispatch(createRole(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save role:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteRole(roleToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to delete role:", err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(changeRoleStatus(id)).unwrap();
      fetchData();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Role Management</h1>
          <p className="text-sm text-tmuted mt-1">Configure user roles and system access levels.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Create New Role</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <Table 
        columns={["Role Name", "Status", "Actions"]} 
        data={roles} 
        keyExtractor={(item) => item._id}
        renderRow={(role) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary-500/10 text-primary-500 rounded-lg">
                  <Shield size={16} />
                </div>
                <span className="font-bold text-tmain text-sm">{role.rolename}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => handleToggleStatus(role._id)}
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
                  role.status 
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
              >
                {role.status ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(role)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(role)}
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
        title={editingRole ? "Edit Role" : "Create New Role"}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput 
            label="Role Name" 
            placeholder="e.g. Sales Manager" 
            value={formData.rolename}
            onChange={(e) => setFormData({ ...formData, rolename: e.target.value })}
            required 
          />

          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        itemName={roleToDelete?.rolename}
      />
    </div>
  );
}
