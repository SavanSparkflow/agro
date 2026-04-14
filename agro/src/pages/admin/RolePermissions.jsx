import { useState } from "react";
import { Shield, Check, X, Save, Lock, Smartphone, Layout, Users, ShoppingBag, Truck } from "lucide-react";
import { usePermission } from "../../context/PermissionContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function RolePermissions() {
  const { role, setRole, permissions, updateRolePermission } = usePermission();
  const [activeTab, setActiveTab] = useState("Admin");

  const roles = Object.keys(permissions).filter(r => r !== "SuperAdmin");
  const modules = Object.keys(permissions[roles[0]]);
  const actions = ["view", "create", "edit", "delete", "search"];

  const getModuleIcon = (module) => {
    switch (module) {
      case 'Products': return <ShoppingBag size={18} />;
      case 'Categories': return <Layout size={18} />;
      case 'Customers': return <Users size={18} />;
      case 'Stock': return <Smartphone size={18} />;
      case 'Dealers': return <Truck size={18} />;
      case 'Users': return <Shield size={18} />;
      default: return <Lock size={18} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Role Permissions</h1>
          <p className="text-sm text-tmuted mt-1">Configure exactly what each user role is allowed to see and perform.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface p-1.5 rounded-xl border border-surfaceBorder shadow-sm">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setActiveTab(r)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === r ? 'bg-form-primary text-white shadow-lg shadow-form-primary/20 scale-105' : 'text-tmuted hover:text-tmain hover:bg-tmuted/10'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Card className="!p-0 overflow-hidden border-surfaceBorder shadow-xl bg-surface relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-500/[0.03] border-b border-surfaceBorder">
                <th className="px-6 py-5 text-[11px] font-black text-tmuted uppercase tracking-widest">Module / Application Area</th>
                {actions.map(action => (
                  <th key={action} className="px-6 py-5 text-[11px] font-black text-tmuted uppercase tracking-widest text-center">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/50">
              {modules.map((module) => (
                <tr key={module} className="hover:bg-primary-500/[0.015] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background border border-surfaceBorder flex items-center justify-center text-tmuted group-hover:text-form-primary transition-colors shadow-sm">
                        {getModuleIcon(module)}
                      </div>
                      <span className="font-bold text-tmain">{module}</span>
                    </div>
                  </td>
                  {actions.map((action) => (
                    <td key={action} className="px-6 py-5 text-center">
                      <button
                        onClick={() => updateRolePermission(activeTab, module, action, !permissions[activeTab][module][action])}
                        className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center mx-auto shadow-sm ${
                          permissions[activeTab][module][action] 
                            ? 'bg-form-primary border-form-primary text-white scale-110 shadow-form-primary/20' 
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
      </Card>

      <div className="flex justify-end pt-4">
         <Button className="rounded-xl px-10 shadow-lg shadow-form-primary/20 py-3.5">
            <Save size={18} />
            <span>Save Configuration</span>
         </Button>
      </div>

      {/* Switch role preview (for testing) */}
      <div className="mt-12 p-10 bg-surface rounded-[2rem] border-2 border-dashed border-surfaceBorder text-center space-y-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-form-primary/20 to-transparent opacity-50" />
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-tmain flex items-center justify-center gap-2">
              <Shield size={16} className="text-form-primary" /> TEST ROLE PREVIEW (GLOBAL)
            </h3>
            <p className="text-[11px] text-tmuted font-medium italic opacity-70">Switch your view to see how the platform adapts to each role instantly.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             {roles.map((r) => (
               <button
                 key={r}
                 onClick={() => setRole(r)}
                 className={`px-8 py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${role === r ? 'bg-form-primary text-white shadow-xl shadow-form-primary/25 ring-4 ring-form-primary/10 border-form-primary scale-105' : 'bg-background border-tmuted/20 text-tmuted hover:border-tmuted/50 hover:bg-surface hover:text-tmain hover:shadow-md'}`}
               >
                 View as {r}
               </button>
             ))}
          </div>
      </div>
    </div>
  );
}
