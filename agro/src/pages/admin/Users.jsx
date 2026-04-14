import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Mail, Shield } from "lucide-react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import DeleteModal from "../../components/ui/DeleteModal";

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const users = [
    { id: 1, name: "Admin Setup", role: "Super Admin", email: "admin@agro.in" },
    { id: 2, name: "Ramesh Traders", role: "Dealer", email: "ramesh.dealer@agro.in" },
    { id: 3, name: "Kisan Suvidha", role: "Dealer", email: "suresh.kisan@agro.in" },
  ];

  const columns = ["User Name", "Role", "Email", "Actions"];

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting user:", userToDelete);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm">
            {item.name.charAt(0)}
          </div>
          <span className="font-bold text-tmain">{item.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold bg-surface text-tmuted border border-surfaceBorder">
          <Shield size={12} className="text-tmuted/70" /> {item.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-tmuted font-medium flex items-center gap-2 italic opacity-80"><Mail size={12} className="text-tmuted/70" /> {item.email}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all" title="Edit">
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteClick(item)}
            className="p-1.5 text-tmuted hover:text-red-500 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all" 
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Users List</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add User</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-11 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        data={users} 
        keyExtractor={(item) => item.id}
        renderRow={renderRow} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Full Name" placeholder="e.g. Ramesh Singh" required />
            <FormInput label="Email Address" type="email" placeholder="ramesh@agro.in" required />
          </div>
          <div className="space-y-1.5">
            <label className="form-label">System Role</label>
            <select className="form-select transition-all">
              <option value="Admin">Admin</option>
              <option value="Dealer">Dealer</option>
            </select>
          </div>
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-md px-6">
              Save User
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        itemName={userToDelete?.name}
      />
    </div>
  );
}
