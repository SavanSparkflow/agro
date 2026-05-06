import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, ShieldCheck, MapPin, Search, ExternalLink, Mail, Phone, FileText, CreditCard, Loader2, Users } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Table from "../../components/ui/Table";
import { fetchDistributors, getDistributor, createDistributor, deleteDistributor, changeDistributorStatus } from "../../redux/slices/distributorSlice";

const mockCustomers = {};

export default function Dealers() {
  const dispatch = useDispatch();
  const { distributors, loading: isFetching } = useSelector((state) => state.distributor);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDealer, setEditingDealer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [currentDealer, setCurrentDealer] = useState(null);

  const columns = ["Dealer Name", "GST", "Phone", "Location", "Bank", "IFSC", "A/C Number", "Customers", "Actions"];

  const filteredDealers = distributors.filter(dealer => 
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.phone.includes(searchTerm)
  );

  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    owner: "",
    phone: "",
    email: "",
    password: "",
    location: "",
    bankName: "",
    ifscCode: "",
    accountNumber: ""
  });

  const fetchData = async () => {
    dispatch(fetchDistributors({
      page: 1,
      limit: 50,
      search: { name: searchTerm },
      sortoption: -1
    }));
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (dealer = null) => {
    if (dealer) {
      try {
        const result = await dispatch(getDistributor(dealer._id)).unwrap();
        const dealerData = result.Data;
        setEditingDealer(dealerData);
        setFormData({
          name: dealerData.name || "",
          gstNumber: dealerData.gstNumber || "",
          owner: dealerData.owner || "",
          phone: dealerData.phone || "",
          email: dealerData.email || "",
          password: "",
          location: dealerData.location || "",
          bankName: dealerData.bankName || "",
          ifscCode: dealerData.ifscCode || "",
          accountNumber: dealerData.accountNumber || ""
        });
      } catch (err) {
        console.error("Failed to fetch dealer details:", err);
      }
    } else {
      setEditingDealer(null);
      setFormData({
        name: "",
        gstNumber: "",
        owner: "",
        phone: "",
        email: "",
        password: "",
        location: "",
        bankName: "",
        ifscCode: "",
        accountNumber: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        distributorid: editingDealer ? editingDealer._id : "",
        ...formData
      };
      const result = await dispatch(createDistributor(payload)).unwrap();
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
    if (window.confirm("Are you sure you want to delete this dealer?")) {
      dispatch(deleteDistributor(dealer._id)).then(() => fetchData());
    }
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-tmain block">{item.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-bold text-primary-500">
        <span className="bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/20">
          {item.gstNumber || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-tmuted font-medium whitespace-nowrap">
        {item.phone}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface text-tmuted border border-surfaceBorder">
           <MapPin size={12} className="text-tmuted/70" /> {item.location}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-tmain whitespace-nowrap">
        {item.bankName || "N/A"}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-tmuted">
        {item.ifscCode || "N/A"}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-tmuted">
        {item.accountNumber || "N/A"}
      </td>
      <td className="px-6 py-4 font-black text-emerald-500 text-lg">
        {item.activeCustomers || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenModal(item)}
            className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
            title="Edit"
          >
            <Plus size={16} className="rotate-45" /> {/* Using Plus as Edit icon placeholder or just import Edit2 */}
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
                  <h3 className="font-extrabold text-tmain leading-tight line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-tmuted font-medium mt-0.5 italic">Owner: {item.owner}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                  {item.activeCustomers || 0} CUST
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 rounded-lg border border-surfaceBorder shadow-sm">
                    <Plus size={14} className="rotate-45" />
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
                <span>{item.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-tmuted font-medium">
                <MapPin size={14} className="opacity-50" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-primary-500">
                <FileText size={14} className="opacity-70" />
                <span className="tracking-tight">{item.gstNumber || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-1">
               <div className="flex items-center gap-2 text-[11px] font-bold text-tmuted/70 uppercase tracking-wider">
                  <CreditCard size={12} /> {item.bankName || "N/A"}
               </div>
               <div className="text-[11px] text-tmuted/50 font-medium">A/C: {item.accountNumber || "N/A"}</div>
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

       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Dealer"
        className="max-w-2xl"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
              label="Dealer Name" 
              placeholder="e.g. Ramesh Traders" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
            <FormInput 
              label="GST Number" 
              placeholder="e.g. 02AAAAA0000A1Z5" 
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
              label="Phone" 
              placeholder="e.g. 9876543210" 
              name="phone"
              value={formData.phone}
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
              type="password" 
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
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required 
              />
              <FormInput 
                label="IFSC Code" 
                placeholder="e.g. HDFC0001234" 
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                required 
              />
            </div>
            <FormInput 
              label="Account Number" 
              placeholder="e.g. 50100234567890" 
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              required 
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
            {(mockCustomers[currentDealer?._id] || []).length > 0 ? (
              mockCustomers[currentDealer?._id].map((cust) => (
                <div key={cust.id} className="p-4 glass rounded-2xl flex items-center justify-between group hover:border-primary-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surfaceBorder flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-tmain leading-tight">{cust.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-tmuted font-medium italic">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {cust.location}</span>
                        <span className="w-1 h-1 rounded-full bg-tmuted/30"></span>
                        <span className="flex items-center gap-1"><Phone size={10} /> {cust.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active Account</span>
                    <p className="text-[10px] text-tmuted mt-1">Joined {cust.joined}</p>
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
    </div>
  );
}
