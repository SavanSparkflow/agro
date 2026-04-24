import { useState, useEffect } from "react";
import { Shield, Check, X, Save, Lock, Smartphone, Layout, Users, ShoppingBag, Truck, Eye, Plus, Edit2, Trash2, FileText, Download, Upload, ToggleLeft, UserCheck, Globe, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useGetRolesMutation } from "../../redux/api/roleApi";
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

export default function RolePermissions() {
  const [activeTab, setActiveTab] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [getRoles, { isLoading: isRolesFetching }] = useGetRolesMutation();
  const [getDepartments, { isLoading: isDeptsFetching }] = useGetDepartmentsMutation();

  const fetchData = async () => {
    try {
      const roleResult = await getRoles({ page: 1, limit: 50 }).unwrap();
      if (roleResult.IsSuccess) {
        setRoles(roleResult.Data.docs || []);
        if (roleResult.Data.docs?.length > 0 && !activeTab) {
          setActiveTab(roleResult.Data.docs[0].rolename);
        }
      }

      const deptResult = await getDepartments({ page: 1, limit: 100, sortfield: "order", sortoption: 1 }).unwrap();
      if (deptResult.IsSuccess) {
        setDepartments(deptResult.Data.docs || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentRole = roles.find(r => r.rolename === activeTab);

  if (isRolesFetching || isDeptsFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-form-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Role Permissions Matrix</h1>
          <p className="text-sm text-tmuted mt-1">Comprehensive view of all user roles and their granular module access.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-surfaceBorder shadow-sm overflow-x-auto max-w-full">
          {roles.map((r) => (
            <button
              key={r._id}
              onClick={() => setActiveTab(r.rolename)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === r.rolename ? 'bg-form-primary text-white shadow-lg shadow-form-primary/20 scale-105' : 'text-tmuted hover:text-tmain hover:bg-tmuted/10'}`}
            >
              {r.rolename}
            </button>
          ))}
        </div>
      </div>

      <Card className="!p-0 overflow-hidden border-surfaceBorder shadow-xl bg-surface relative z-10">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-primary-500/[0.03] border-b border-surfaceBorder">
                <th className="px-6 py-5 text-[11px] font-black text-tmuted uppercase tracking-widest sticky left-0 bg-surface z-20 w-48 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Module / Department</th>
                {PERMISSION_FIELDS.map(field => (
                  <th key={field.id} className="px-3 py-5 text-[11px] font-black text-tmuted uppercase tracking-widest text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <field.icon size={12} className="opacity-60" />
                      <span>{field.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/50">
              {departments.map((dept) => {
                const perm = currentRole?.permission?.find(p => p.mainmenu === dept.name || p.collectionname === dept.name);
                return (
                  <tr key={dept._id} className="hover:bg-primary-500/[0.015] transition-colors group">
                    <td className="px-6 py-5 sticky left-0 bg-surface/90 backdrop-blur-sm z-10 group-hover:bg-primary-500/[0.015] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background border border-surfaceBorder flex items-center justify-center text-tmuted group-hover:text-form-primary transition-colors shadow-sm">
                          {dept.icon ? <img src={dept.icon} className="w-4 h-4 object-contain" /> : <Layout size={14} />}
                        </div>
                        <span className="font-bold text-tmain text-sm">{dept.name}</span>
                      </div>
                    </td>
                    {PERMISSION_FIELDS.map((field) => (
                      <td key={field.id} className="px-3 py-5 text-center">
                        <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center mx-auto shadow-sm ${
                          perm?.[field.id] 
                            ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-emerald-500/20' 
                            : 'bg-transparent border-tmuted/10 text-transparent'
                        }`}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-end pt-4 gap-4">
         <p className="text-[10px] text-tmuted italic mt-2">To modify these permissions, please use the <span className="font-bold text-form-primary">Role Management</span> section.</p>
      </div>
    </div>
  );
}
