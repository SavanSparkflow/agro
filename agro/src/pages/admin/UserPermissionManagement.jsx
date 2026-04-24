import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Shield, ShieldCheck, ShieldAlert, Check, X, Save, Search, Loader2, User, Key, Layout, Eye, Plus, Edit2, Trash2, FileText, Download, Upload, ToggleLeft, UserCheck, Globe, Users } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import FormInput from "../../components/ui/FormInput";
import { 
  useGetPermissionsMutation, 
  useCreateOrUpdatePermissionMutation 
} from "../../redux/api/permissionApi";
import { useGetDepartmentsMutation } from "../../redux/api/departmentApi";

const PERMISSION_FIELDS = [
  { id: "mainmenu", label: "Nav", icon: Layout },
  { id: "view", label: "View", icon: Eye },
  { id: "create", label: "Create", icon: Plus },
  { id: "edit", label: "Edit", icon: Edit2 },
  { id: "delete", label: "Delete", icon: Trash2 },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "excel", label: "Excel", icon: Download },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "status", label: "Status", icon: ToggleLeft },
  { id: "isown", label: "Own", icon: UserCheck },
  { id: "isglobal", label: "Global", icon: Globe },
  { id: "isassign", label: "Assign", icon: Users },
];

export default function UserPermissionManagement() {
  const [userPermissions, setUserPermissions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermission, setSelectedPermission] = useState(null);
  
  const [formData, setFormData] = useState({
    userid: "",
    permission: []
  });

  const [getPermissions, { isLoading: isFetching }] = useGetPermissionsMutation();
  const [getDepartments] = useGetDepartmentsMutation();
  const [createOrUpdatePermission, { isLoading: isSaving }] = useCreateOrUpdatePermissionMutation();

  const fetchData = async () => {
    try {
      // Fetch Permissions
      const permResult = await getPermissions({
        page: 1,
        limit: 50,
        search: searchQuery,
        sortfield: "_id",
        sortoption: 1
      }).unwrap();
      if (permResult.IsSuccess) {
        setUserPermissions(permResult.Data.docs || []);
      }

      // Fetch Departments
      const deptResult = await getDepartments({
        page: 1,
        limit: 100,
        sortfield: "order",
        sortoption: 1
      }).unwrap();
      if (deptResult.IsSuccess) {
        setDepartments(deptResult.Data.docs || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const { user: currentUser } = useSelector((state) => state.auth);

  const handleOpenModal = (perm = null) => {
    if (perm) {
      setSelectedPermission(perm);
      const mappedPermissions = departments.map(d => {
        const existing = perm.permission?.find(p => p.mainmenu === d.name || p.collectionname === d.name);
        return {
          collectionname: d.name,
          mainmenu: existing?.mainmenu ?? false,
          view: existing?.view ?? false,
          create: existing?.create ?? false,
          edit: existing?.edit ?? false,
          delete: existing?.delete ?? false,
          pdf: existing?.pdf ?? false,
          excel: existing?.excel ?? false,
          upload: existing?.upload ?? false,
          status: existing?.status ?? false,
          isown: existing?.isown ?? false,
          isglobal: existing?.isglobal ?? false,
          isassign: existing?.isassign ?? false,
        };
      });
      setFormData({
        userid: perm.userid?._id || perm.userid || "",
        permission: mappedPermissions
      });
    } else {
      setSelectedPermission(null);
      setFormData({
        userid: currentUser?._id || "",
        permission: departments.map(d => ({
          collectionname: d.name,
          mainmenu: false,
          view: false,
          create: false,
          edit: false,
          delete: false,
          pdf: false,
          excel: false,
          upload: false,
          status: false,
          isown: false,
          isglobal: false,
          isassign: false,
        }))
      });
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (collectionName, field) => {
    setFormData(prev => ({
      ...prev,
      permission: prev.permission.map(p => {
        if (p.collectionname === collectionName) {
          return { ...p, [field]: !p[field] };
        }
        return p;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        permissionid: selectedPermission ? selectedPermission._id : "",
        ...formData
      };
      const result = await createOrUpdatePermission(payload).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save user permissions:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">User Permissions</h1>
          <p className="text-sm text-tmuted mt-1">Override role-based permissions for specific users.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Key size={18} />
          <span>Assign Custom Permission</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <Table 
        columns={["User", "Email", "Custom Rules", "Actions"]} 
        data={userPermissions} 
        keyExtractor={(item) => item._id}
        renderRow={(perm) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                  <User size={16} />
                </div>
                <span className="font-bold text-tmain text-sm">{perm.userid?.name || "Unknown User"}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-tmuted">{perm.userid?.email || "N/A"}</span>
            </td>
            <td className="px-6 py-4">
              <span className="text-[10px] font-black text-tmuted uppercase tracking-widest bg-background px-2 py-1 rounded border border-surfaceBorder">
                {perm.permission?.length || 0} Override Modules
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(perm)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Shield size={14} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedPermission ? "Edit User Overrides" : "Assign User Overrides"}
        className="max-w-[95%] lg:max-w-7xl w-[95vw]"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!selectedPermission && (
            <div className="max-w-md space-y-2">
              <div className="relative group">
                <FormInput 
                  label="User Name" 
                  value={formData.userid === currentUser?._id ? currentUser?.name : formData.userid}
                  readOnly
                  className="font-bold"
                />
              </div>
            </div>
          )}

          {selectedPermission && (
            <div className="p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <User size={24} />
              </div>
              <div>
                <h4 className="font-bold text-tmain">{selectedPermission.userid?.name}</h4>
                <p className="text-xs text-tmuted">{selectedPermission.userid?.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-black text-tmuted uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={14} className="text-form-primary" /> Permission Override Matrix
            </h3>
            
            <div className="border border-surfaceBorder rounded-xl overflow-hidden shadow-sm bg-surface/50">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface/50 border-b border-surfaceBorder">
                      <th className="px-4 py-4 text-[10px] font-black text-tmuted uppercase tracking-widest sticky left-0 bg-surface z-20 w-48 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Module / Department</th>
                      {PERMISSION_FIELDS.map(field => (
                        <th key={field.id} className="px-2 py-4 text-[10px] font-black text-tmuted uppercase tracking-widest text-center min-w-[60px]">
                          <div className="flex flex-col items-center gap-1.5">
                            <field.icon size={12} className="opacity-60" />
                            <span>{field.label}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surfaceBorder">
                    {formData.permission.map((perm) => (
                      <tr key={perm.collectionname} className="hover:bg-primary-500/[0.02] transition-colors group">
                        <td className="px-4 py-4 sticky left-0 bg-surface/90 backdrop-blur-sm z-10 group-hover:bg-primary-500/[0.02] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-form-primary/30" />
                            <span className="font-bold text-tmain text-xs">{perm.collectionname}</span>
                          </div>
                        </td>
                        {PERMISSION_FIELDS.map(field => (
                          <td key={field.id} className="px-2 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePermission(perm.collectionname, field.id)}
                              className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center mx-auto ${
                                perm[field.id] 
                                  ? 'bg-form-primary border-form-primary text-white shadow-lg shadow-form-primary/20 scale-110' 
                                  : 'bg-transparent border-tmuted/20 hover:border-form-primary/40 text-transparent'
                              }`}
                            >
                              <Check size={14} strokeWidth={4} />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              Save Overrides
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
