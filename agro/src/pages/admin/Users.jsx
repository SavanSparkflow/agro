import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Mail, Shield, Loader2, Save, User as UserIcon, Phone, MapPin, Building2, Landmark, CreditCard, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import DeleteModal from "../../components/ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getUser, createUser, deleteUser, changeUserStatus } from "../../redux/slices/userSlice";
import { fetchRolesWOP } from "../../redux/slices/roleSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading: isFetching } = useSelector((state) => state.user);
  const { rolesWOP: roles } = useSelector((state) => state.role);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    fathername: "",
    gstnumber: "",
    address: "",
    bankname: "",
    bankaccountnumber: "",
    bankifsccode: "",
    email: "",
    countrycode: "+91",
    mobile: "",
    password: "",
    roleid: ""
  });

  const fetchData = async () => {
    dispatch(fetchUsers({
      page: 1,
      limit: 50,
      search: { name: searchTerm },
      sortfield: "_id",
      sortoption: -1,
      roleid: "",
      branchid: ""
    }));
  };

  useEffect(() => {
    fetchData();
    dispatch(fetchRolesWOP(""));
  }, [searchTerm]);

  const handleOpenModal = async (user = null) => {
    if (user) {
      try {
        const result = await dispatch(getUser(user._id)).unwrap();
        const userData = result.Data;
        setEditingUser(userData);
        setFormData({
          name: userData.name || "",
          surname: userData.surname || "",
          fathername: userData.fathername || "",
          gstnumber: userData.gstnumber || "",
          address: userData.address || "",
          bankname: userData.bankname || "",
          bankaccountnumber: userData.bankaccountnumber || "",
          bankifsccode: userData.bankifsccode || "",
          email: userData.email || "",
          countrycode: userData.countrycode || "+91",
          mobile: userData.mobile || "",
          password: "", // Password usually not returned for security
          roleid: userData.roleid?._id || userData.roleid || ""
        });
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        surname: "",
        fathername: "",
        gstnumber: "",
        address: "",
        bankname: "",
        bankaccountnumber: "",
        bankifsccode: "",
        email: "",
        countrycode: "+91",
        mobile: "",
        password: "",
        roleid: ""
      });
    }
    setErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.fathername.trim()) newErrors.fathername = "Father's name is required";
    if (!formData.address.trim()) newErrors.address = "Location/Address is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";
    
    if (!formData.roleid) newErrors.roleid = "Please select a system role";
    
    if (!editingUser && !formData.password) {
      newErrors.password = "Password is required for new accounts";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const payload = {
        userid: editingUser ? editingUser._id : "",
        ...formData
      };
      const result = await dispatch(createUser(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save user:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(userToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(changeUserStatus(id)).unwrap();
      fetchData();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  const columns = ["User Name", "Role", "Contact", "Status", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm">
            {item.name?.charAt(0) || "U"}
          </div>
          <div>
            <span className="font-bold text-tmain block">{item.name} {item.surname || ""}</span>
            <span className="text-[10px] text-tmuted uppercase tracking-wider">{item.email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold bg-surface text-tmuted border border-surfaceBorder">
          <Shield size={12} className="text-tmuted/70" /> {item.roleid?.rolename || "No Role"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-tmain font-medium flex items-center gap-2">
            <Phone size={12} className="text-tmuted" /> {item.countrycode} {item.mobile}
          </span>
          <span className="text-[10px] text-tmuted italic flex items-center gap-2">
             <MapPin size={10} /> {item.location || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <button 
          onClick={() => handleToggleStatus(item._id)}
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
            item.status 
              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          }`}
        >
          {item.status ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenModal(item)}
            className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all" 
            title="Edit"
          >
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
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">User Management</h1>
          <p className="text-sm text-tmuted mt-1">Manage system users, contact details, and banking information.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add New User</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email or mobile..." 
            className="w-full pl-11 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        data={users} 
        keyExtractor={(item) => item._id}
        renderRow={renderRow} 
        isLoading={isFetching}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Account" : "Create New User Account"}
        className="max-w-4xl"
      >
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          {/* Section: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-form-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <UserIcon size={14} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormInput label="First Name" placeholder="e.g. Ramesh" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} error={errors.name} required />
              <FormInput label="Surname" placeholder="e.g. Singh" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} error={errors.surname} required />
              <FormInput label="Father's Name" placeholder="e.g. Baldev Singh" value={formData.fathername} onChange={(e) => setFormData({...formData, fathername: e.target.value})} error={errors.fathername} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormInput label="GST Number" placeholder="22AAAAA0000A1Z5" value={formData.gstnumber} onChange={(e) => setFormData({...formData, gstnumber: e.target.value})} />
              <div className="md:col-span-2">
                <FormInput label="Location / Address" placeholder="City, State, Country" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} error={errors.address} required />
              </div>
            </div>
          </div>

          {/* Section: Contact & Auth */}
          <div className="space-y-4 pt-4 border-t border-surfaceBorder/50">
            <h3 className="text-[10px] font-black text-form-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={14} /> Contact & Authentication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormInput label="Email Address" type="email" placeholder="ramesh@agro.in" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} error={errors.email} required />
              <div className="flex gap-2">
                <div className="w-24">
                  <FormInput label="Code" value={formData.countrycode} onChange={(e) => setFormData({...formData, countrycode: e.target.value})} required />
                </div>
                <div className="flex-1">
                  <FormInput label="Mobile Number" placeholder="9876543210" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} error={errors.mobile} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-tmuted uppercase tracking-widest ml-1">System Role</label>
                <select 
                  className={cn(
                    "w-full px-4 py-2.5 bg-background border border-surfaceBorder rounded-md text-sm outline-none focus:border-form-primary transition-all text-tmain",
                    errors.roleid && "!border-red-500 !focus:border-red-500"
                  )}
                  value={formData.roleid}
                  onChange={(e) => setFormData({...formData, roleid: e.target.value})}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(r => (
                    <option key={r._id} value={r._id}>{r.rolename}</option>
                  ))}
                </select>
                {errors.roleid && <span className="text-[11px] font-medium text-red-500 mt-1 block">{errors.roleid}</span>}
              </div>
            </div>
            <div className="max-w-md">
              <FormInput 
                label="Login Password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                error={errors.password} 
                required={!editingUser} 
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-tmuted hover:text-form-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
              {editingUser && <p className="text-[10px] text-tmuted mt-1 italic">Leave blank to keep existing password.</p>}
            </div>
          </div>

          {/* Section: Banking Information */}
          <div className="space-y-4 pt-4 border-t border-surfaceBorder/50">
            <h3 className="text-[10px] font-black text-form-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Landmark size={14} /> Banking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormInput label="Bank Name" placeholder="e.g. State Bank of India" value={formData.bankname} onChange={(e) => setFormData({...formData, bankname: e.target.value})} />
              <FormInput label="Account Number" placeholder="00000000000" value={formData.bankaccountnumber} onChange={(e) => setFormData({...formData, bankaccountnumber: e.target.value})} />
              <FormInput label="IFSC Code" placeholder="SBIN0000001" value={formData.bankifsccode} onChange={(e) => setFormData({...formData, bankifsccode: e.target.value})} />
            </div>
          </div>
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md px-6" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingUser ? "Update Account" : "Create Account"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        itemName={`${userToDelete?.name} ${userToDelete?.surname || ""}`}
      />
    </div>
  );
}
