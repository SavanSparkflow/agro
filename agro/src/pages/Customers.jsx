import { useState, useEffect } from "react";
import { Plus, Search, MessageSquare, Send, CornerUpRight, Calendar, ArrowRight as ArrowRightIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, submitCustomerFeedback } from "../redux/slices/customerSlice";
import { cn } from "../lib/utils";

export default function Customers() {
  const dispatch = useDispatch();
  const { customers, totalRecords, loading } = useSelector((state) => state.customer);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [reply, setReply] = useState("");
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const columns = ["Customer Name", "Contact", "Location / Email", "Dealer", "Latest Feedback"];

  const fetchData = async () => {
    const payload = {
      page: currentPage,
      limit: limit,
      search: searchTerm ? { name: searchTerm } : "",
      distributorid: [],
      name: [],
      email: [],
      countrycode: [],
      mobile: [],
      sortoption: -1,
      fromDate: fromDate,
      toDate: toDate
    };
    dispatch(fetchCustomers(payload));
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, searchTerm, fromDate, toDate]);

  const handleSaveFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSavingFeedback(true);
    try {
      const result = await dispatch(submitCustomerFeedback({
        customerid: selectedCustomer._id,
        feedback: feedback
      })).unwrap();

      if (result.IsSuccess) {
        setIsFeedbackModalOpen(false);
        setFeedback("");
        setReply("");
        fetchData(); // Refresh list to show new feedback count if applicable
      }
    } catch (err) {
      console.error("Failed to save feedback:", err);
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
            {item.name?.charAt(0) || "C"}
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => {
                setSelectedCustomer(item);
                setFeedback(item.feedback || "");
                setIsFeedbackModalOpen(true);
              }}
              className="font-bold text-tmain text-left hover:text-primary-500 transition-colors border-b border-dashed border-tmuted/20 hover:border-primary-500/50 pb-0.5 w-fit"
            >
              {item.name}
            </button>
            <span className="text-[10px] text-tmuted font-medium uppercase tracking-wider mt-1">ID: {item._id?.slice(-8)}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-tmain">{item.countrycode} {item.mobile}</span>
          <span className="text-[11px] text-tmuted italic">{item.email?.includes('@') ? item.email : ""}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded text-[11px] font-bold bg-surface text-tmuted border border-surfaceBorder whitespace-nowrap max-w-[200px] truncate" title={item.village || item.address || item.email}>
          {item.village || item.address || (item.email?.includes('@') ? "N/A" : item.email) || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4">
        {item.distributorid?.name ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tight">
            <CornerUpRight size={10} /> {item.distributorid.name}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-tmuted/40 italic uppercase tracking-widest">No Dealer</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-[180px]">
          <p className="text-[11px] text-tmuted line-clamp-2 italic leading-relaxed" title={item.feedback}>
            {item.feedback ? `"${item.feedback}"` : "No feedback yet"}
          </p>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Customers</h1>
          <p className="text-sm text-tmuted mt-1">View all registered customers and their feedback.</p>
        </div>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col lg:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full lg:w-80 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-11 pr-4 py-2.5 bg-background border border-surfaceBorder rounded-xl text-sm focus:border-form-primary focus:ring-1 focus:ring-form-primary outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-background border border-surfaceBorder p-1.5 rounded-xl shadow-inner w-full lg:w-auto">
            <div className="relative flex-1 min-w-[140px] lg:w-40">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs font-bold text-tmain focus:ring-0 outline-none appearance-none cursor-pointer placeholder:text-tmuted/40"
              />
            </div>

            <div className="text-tmuted/30 hidden sm:block">
              <ArrowRightIcon size={14} />
            </div>

            <div className="relative flex-1 min-w-[140px] lg:w-40">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tmuted pointer-events-none" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border-none text-xs font-bold text-tmain focus:ring-0 outline-none appearance-none cursor-pointer placeholder:text-tmuted/40"
              />
            </div>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={customers}
        keyExtractor={(item) => item._id || item.id}
        renderRow={renderRow}
        isLoading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        limit={limit}
        onPageChange={(page) => setCurrentPage(page)}
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
              {selectedCustomer?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="font-bold text-tmain text-lg leading-tight">{selectedCustomer?.name}</h3>
              <p className="text-xs text-tmuted font-medium">{selectedCustomer?.mobile} • {selectedCustomer?.village || selectedCustomer?.address || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
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
              onClick={handleSaveFeedback}
              disabled={isSavingFeedback || !feedback.trim()}
            >
              {isSavingFeedback ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Feedback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
