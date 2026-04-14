import { useState } from "react";
import { Plus, Search, Edit2, Trash2, MessageSquare, Send, User, CornerUpRight, Calendar, ArrowRight as ArrowRightIcon } from "lucide-react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import DeleteModal from "../components/ui/DeleteModal";
import { cn } from "../lib/utils";

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [reply, setReply] = useState("");

  const customers = [
    { id: 1, name: "Ramesh Farmer", mobile: "+91 9876543210", village: "Palampur" },
    { id: 2, name: "Suresh Singh", mobile: "+91 8765432109", village: "Anandpur" },
    { id: 3, name: "Mukesh Kumar", mobile: "+91 7654321098", village: "Rampur" },
  ];

  const dealers = [
    { id: 1, name: "Premium Agro Dealer" },
    { id: 2, name: "Global Seeds & Chemicals" },
    { id: 3, name: "Modern Farming Solutions" },
  ];

  const columns = ["Name", "Mobile", "Village", "Actions"];

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting customer:", customerToDelete);
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
            {item.name.charAt(0)}
          </div>
          <button 
            onClick={() => {
              setSelectedCustomer(item);
              setIsFeedbackModalOpen(true);
            }}
            className="font-bold text-tmain text-left hover:text-primary-500 transition-colors border-b border-dashed border-tmuted/20 hover:border-primary-500/50 pb-0.5"
          >
            {item.name}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium text-sm">{item.mobile}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded text-[11px] font-bold bg-surface text-tmuted border border-surfaceBorder whitespace-nowrap">
          {item.village}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* <button className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all" title="Edit">
            <Edit2 size={16} />
          </button> */}
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
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Customers</h1>
        </div>
        {/* <Button onClick={() => setIsModalOpen(true)} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Customer</span>
        </Button> */}
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col lg:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full lg:w-80 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-11 pr-4 py-2.5 bg-background border border-surfaceBorder rounded-xl text-sm focus:border-form-primary focus:ring-1 focus:ring-form-primary outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-background border border-surfaceBorder p-1.5 rounded-xl shadow-inner w-full lg:w-auto">
            {/* From Date */}
            <div className="relative flex-1 min-w-[140px] lg:w-40">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs font-bold text-tmain focus:ring-0 outline-none appearance-none cursor-pointer placeholder:text-tmuted/40"
                placeholder="From"
              />
            </div>

            <div className="text-tmuted/30 hidden sm:block">
              <ArrowRightIcon size={14} />
            </div>

            {/* To Date */}
            <div className="relative flex-1 min-w-[140px] lg:w-40">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs font-bold text-tmain focus:ring-0 outline-none appearance-none cursor-pointer placeholder:text-tmuted/40"
              />
            </div>
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={customers} 
        keyExtractor={(item) => item.id}
        renderRow={renderRow} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
      >
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-tmuted uppercase tracking-widest pl-1">Assign to Dealer</label>
            <select className="w-full px-4 py-3 bg-surface border border-surfaceBorder rounded-xl text-sm font-medium focus:border-form-primary outline-none transition-all shadow-sm">
              <option value="">-- Choose a Dealer --</option>
              {dealers.map(dealer => (
                <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Customer Name" placeholder="e.g. Ramesh Singh" required />
            <FormInput label="Mobile Number" placeholder="e.g. 9876543210" required />
          </div>
          <FormInput label="Village / Address" placeholder="e.g. Palampur" required />
          
          <div className="p-5 bg-primary-500/10 border border-primary-500/20 rounded-xl relative mt-4">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 rounded-l-xl"></div>
             <h4 className="text-[11px] font-black text-primary-400 mb-4 tracking-widest uppercase">App Login Credentials</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormInput type="email" label="Customer Email" placeholder="customer@agro.in" required />
               <FormInput type="password" label="Customer Password" placeholder="••••••••" required />
             </div>
             <p className="text-[10px] text-tmuted mt-3 font-medium italic">These credentials will allow the customer to log directly into the external Agro mobile application.</p>
          </div>
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-md px-6">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        itemName={customerToDelete?.name}
      />

      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Customer Feedback & Support"
        className="max-w-xl"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-surfaceBorder">
            <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/20">
              {selectedCustomer?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-tmain text-lg leading-tight">{selectedCustomer?.name}</h3>
              <p className="text-xs text-tmuted font-medium">{selectedCustomer?.mobile} • {selectedCustomer?.village}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Feedback Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-tmuted uppercase tracking-widest pl-1">
                <MessageSquare size={14} className="text-primary-500" />
                Customer Feedback
              </label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did the customer say about our services?"
                className="w-full bg-surface border border-surfaceBorder rounded-2xl p-4 text-sm focus:border-form-primary focus:ring-1 focus:ring-form-primary outline-none text-tmain placeholder:text-tmuted/50 min-h-[100px] resize-none transition-all shadow-inner"
              />
            </div>

            {/* Reply Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-tmuted uppercase tracking-widest pl-1">
                <CornerUpRight size={14} className="text-emerald-500" />
                Your Reply
              </label>
              <div className="relative group">
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your official response here..."
                  className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 pr-12 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-tmain placeholder:text-tmuted/50 min-h-[100px] resize-none transition-all shadow-inner"
                />
                <button className="absolute bottom-4 right-4 p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-surfaceBorder/50 flex justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsFeedbackModalOpen(false)}>
               Cancel
             </Button>
             <Button 
               className="bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 px-8"
               onClick={() => {
                 console.log("Saving Feedback for:", selectedCustomer?.name, { feedback, reply });
                 setIsFeedbackModalOpen(false);
               }}
              >
               Save
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
