import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, ShieldCheck, MapPin, Search, ExternalLink, Mail, Phone, FileText, CreditCard, Loader2, Users, Pencil } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import { fetchUsers, getUser, createUser, deleteUser, changeUserStatus } from "../../redux/slices/userSlice";
import { fetchRolesWOP } from "../../redux/slices/roleSlice";
import { fetchCustomersWOP } from "../../redux/slices/customerSlice";
import DeleteModal from "../../components/ui/DeleteModal";
import { cn } from "../../lib/utils";

const mockCustomers = {};

export default function Dealers() {
  const dispatch = useDispatch();
  const { users: dealers, totalRecords, loading: isFetching } = useSelector((state) => state.user);
  const { rolesWOP: roles } = useSelector((state) => state.role);
  const { customersWOP } = useSelector((state) => state.customer);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDealer, setEditingDealer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealerToDelete, setDealerToDelete] = useState(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [currentDealer, setCurrentDealer] = useState(null);

  const columns = ["Dealer Name", "GST", "Phone", "Location", "Bank", "IFSC", "A/C Number", "Customers", "Actions"];

  const filteredDealers = dealers; // Using server-side filtering

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    fathername: "",
    gstnumber: "",
    mobile: "",
    email: "",
    countrycode: "+91",
    password: "",
    location: "",
    bankname: "",
    bankifsccode: "",
    bankaccountnumber: "",
    roleid: ""
  });

  // Find the exact 'Dealer' role ID from the system roles
  const dealerRole = roles.find(r => r.rolename === 'Dealer')?._id || roles.find(r => r.rolename?.toLowerCase().includes('dealer'))?._id || "";

  const fetchData = async () => {
    dispatch(fetchUsers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm ? { name: searchTerm } : "",
      sortfield: "_id",
      sortoption: -1,
      roleid: dealerRole,
      branchid: ""
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchRolesWOP(""));
  }, []);

  useEffect(() => {
    if (dealerRole || !roles.length) {
      fetchData();
    }
  }, [searchTerm, dealerRole, currentPage]);

  useEffect(() => {
    if (isCustomerModalOpen) {
      dispatch(fetchCustomersWOP(""));
    }
  }, [isCustomerModalOpen]);

  const dealerCustomers = (customersWOP?.docs || customersWOP || []).filter(cust =>
    cust.distributorid?._id === currentDealer?._id || cust.distributorid === currentDealer?._id
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (dealer = null) => {
    if (dealer) {
      try {
        const result = await dispatch(getUser(dealer._id)).unwrap();
        const dealerData = result.Data;
        setEditingDealer(dealerData);
        setFormData({
          name: dealerData.name || "",
          surname: dealerData.surname || "",
          fathername: dealerData.fathername || "",
          gstnumber: dealerData.gstnumber || "",
          mobile: dealerData.mobile || "",
          email: dealerData.email || "",
          countrycode: dealerData.countrycode || "+91",
          password: dealerData.password || "",
          location: dealerData.location || "",
          bankname: dealerData.bankname || "",
          bankifsccode: dealerData.bankifsccode || "",
          bankaccountnumber: dealerData.bankaccountnumber || "",
          roleid: dealerData.roleid?._id || dealerData.roleid || dealerRole
        });
      } catch (err) {
        console.error("Failed to fetch dealer details:", err);
      }
    } else {
      setEditingDealer(null);
      setFormData({
        name: "",
        surname: "",
        fathername: "",
        gstnumber: "",
        mobile: "",
        email: "",
        countrycode: "+91",
        password: "",
        location: "",
        bankname: "",
        bankifsccode: "",
        bankaccountnumber: "",
        roleid: dealerRole
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        userid: editingDealer ? editingDealer._id : "",
        ...formData,
        roleid: formData.roleid || dealerRole
      };
      const result = await dispatch(createUser(payload)).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save dealer:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (dealer) => {
    setDealerToDelete(dealer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(dealerToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to delete dealer:", err);
    }
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-tmain block">{item.name} {item.surname || ""}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-bold text-primary-500">
        <span className="bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/20">
          {item.gstnumber || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-tmuted font-medium whitespace-nowrap">
        {item.mobile}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface text-tmuted border border-surfaceBorder">
          <MapPin size={12} className="text-tmuted/70" /> {item.address || item.location || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-tmain whitespace-nowrap">
        {item.bankname || "N/A"}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-tmuted">
        {item.bankifsccode || "N/A"}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-tmuted">
        {item.bankaccountnumber || "N/A"}
      </td>
      <td className="px-6 py-4 font-black text-emerald-500 text-lg">
        {item.customerCount || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(item)}
            className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
            title="Edit"
          >
            <Pencil size={16} /> {/* Using Plus as Edit icon placeholder or just import Edit2 */}
          </button>
          <button
            onClick={() => handleDeleteClick(item)}
            className="p-1.5 text-tmuted hover:text-red-500 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => {
              setCurrentDealer(item);
              setIsCustomerModalOpen(true);
            }}
            className="text-xs text-primary-500 font-bold hover:text-primary-600 flex items-center gap-1 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg border border-primary-500/20 transition-all shadow-sm whitespace-nowrap"
          >
            <ExternalLink size={14} /> Customers
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-tmain tracking-tight">Dealer List</h1>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Create Dealer</span>
        </Button>
      </div>

      <div className="glass p-4 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input
            type="text"
            placeholder="Search Dealer network..."
            className="w-full pl-11 pr-4 py-3 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-form-primary focus:ring-1 focus:ring-form-primary outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          data={filteredDealers}
          keyExtractor={(item) => item._id}
          renderRow={renderRow}
          isLoading={isFetching}
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden mt-4">
        {filteredDealers.map((item) => (
          <Card key={item._id} className="relative overflow-hidden border-surfaceBorder/60 hover:border-rose-500/30 transition-all p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center font-bold shadow-sm shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-tmain leading-tight line-clamp-1">{item.name} {item.surname || ""}</h3>
                  <p className="text-xs text-tmuted font-medium mt-0.5 italic">Father: {item.fathername || "N/A"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                  {item.customerCount || 0} CUST
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 rounded-lg border border-surfaceBorder shadow-sm">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDeleteClick(item)} className="p-1.5 text-tmuted hover:text-red-500 bg-surface/50 rounded-lg border border-surfaceBorder shadow-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-surfaceBorder/40">
              <div className="flex items-center gap-2 text-[13px] text-tmuted font-medium">
                <Mail size={14} className="opacity-50" />
                <span className="truncate">{item.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-tmuted font-medium">
                <Phone size={14} className="opacity-50" />
                <span>{item.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-tmuted font-medium">
                <MapPin size={14} className="opacity-50" />
                <span>{item.address || item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-primary-500">
                <FileText size={14} className="opacity-70" />
                <span className="tracking-tight">{item.gstnumber || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-tmuted/70 uppercase tracking-wider">
                <CreditCard size={12} /> {item.bankname || "N/A"}
              </div>
              <div className="text-[11px] text-tmuted/50 font-medium">A/C: {item.bankaccountnumber || "N/A"}</div>
            </div>

            <Button
              onClick={() => {
                setCurrentDealer(item);
                setIsCustomerModalOpen(true);
              }}
              className="w-full justify-center bg-primary-500 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 py-3 rounded-xl gap-2 font-bold"
            >
              <ExternalLink size={16} /> View Customers Relationship
            </Button>
          </Card>
        ))}
        {(filteredDealers.length === 0 && !isFetching) && (
          <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-surfaceBorder">
            <div className="w-16 h-16 rounded-full bg-tmuted/10 flex items-center justify-center mx-auto text-tmuted/30 mb-4">
              <Search size={32} />
            </div>
            <h4 className="text-lg font-bold text-tmain">No matches found</h4>
            <p className="text-sm text-tmuted">Try adjusting your search to find the dealer you're looking for.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        limit={itemsPerPage}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Dealer"
        className="max-w-2xl"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="First Name"
              placeholder="e.g. Ramesh"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Surname"
              placeholder="e.g. Singh"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Father Name"
              placeholder="e.g. Baldev Singh"
              name="fathername"
              value={formData.fathername}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="GST Number"
              placeholder="e.g. 02AAAAA0000A1Z5"
              name="gstnumber"
              value={formData.gstnumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Mobile"
              placeholder="e.g. 9876543210"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Location"
              placeholder="e.g. Palampur"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-surfaceBorder/50">
            <FormInput
              type="email"
              label="Dealer Login Email"
              placeholder="dealer@agro.in"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormInput
              type="text"
              label="Dealer Assigned Password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="pt-4 border-t border-surfaceBorder/50 space-y-4">
            <h4 className="text-[10px] font-black text-tmuted uppercase tracking-[0.2em]">Bank Settlement Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Bank Name"
                placeholder="e.g. HDFC Bank"
                name="bankname"
                value={formData.bankname}
                onChange={handleInputChange}
              />
              <FormInput
                label="IFSC Code"
                placeholder="e.g. HDFC0001234"
                name="bankifsccode"
                value={formData.bankifsccode}
                onChange={handleInputChange}
              />
            </div>
            <FormInput
              label="Account Number"
              placeholder="e.g. 50100234567890"
              name="bankaccountnumber"
              value={formData.bankaccountnumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-md px-6 py-2">
              Create Dealer Account
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={currentDealer ? `${currentDealer.name} - Network Customers` : "Customer List"}
        className="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {dealerCustomers.length > 0 ? (
              dealerCustomers.map((cust) => (
                <div key={cust.id} className="p-4 glass rounded-2xl flex items-center justify-between group hover:border-primary-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surfaceBorder flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-tmain leading-tight">{cust.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-tmuted font-medium italic">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {cust.address || cust.village || cust.email}</span>
                        <span className="w-1 h-1 rounded-full bg-tmuted/30"></span>
                        <span className="flex items-center gap-1"><Phone size={10} /> {cust.mobile}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active Account</span>
                    <p className="text-[10px] text-tmuted mt-1">Joined {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-tmuted/10 flex items-center justify-center mx-auto text-tmuted/50">
                  <Users size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-tmain">No Active Customers</h4>
                  <p className="text-sm text-tmuted">This dealer hasn't onboarded any customers to the network yet.</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-surfaceBorder/50 flex justify-end mt-4">
            <Button onClick={() => setIsCustomerModalOpen(false)}>
              Close Relationship View
            </Button>
          </div>
        </div>
      </Modal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={dealerToDelete ? `${dealerToDelete.name} ${dealerToDelete.surname || ""}` : ""}
      />
    </div>
  );
}
