import { useState } from "react";
import { MessageSquare, Search, Reply, CheckCircle2, Clock } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([
    { 
      id: 1, 
      dealer: "Ramesh Traders",
      customer: "Suresh Singh", 
      date: "Oct 24, 2026",
      feedback1: "Quality of DAP Fertilizer",
      feedback2: "The recent batch of DAP fertilizer is clumping together due to moisture. Need better packaging.",
      status: "replied",
      reply: "We apologize for the inconvenience. We have escalated this to the packaging team and will replace your affected stock immediately."
    },
    { 
      id: 2, 
      dealer: "Kisan Suvidha Kendra",
      customer: "Mukesh Kumar", 
      date: "Oct 22, 2026",
      feedback1: "Delivery Delay",
      feedback2: "The tomato seeds were delivered 3 days late during peak sowing season.",
      status: "pending",
      reply: null
    }
  ]);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleReplyClick = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.reply || "");
    setIsReplyModalOpen(true);
  };

  const handleSaveReply = (e) => {
    e.preventDefault();
    setFeedbacks(feedbacks.map(f => {
      if (f.id === selectedFeedback.id) {
        return { ...f, reply: replyText, status: "replied" };
      }
      return f;
    }));
    setIsReplyModalOpen(false);
  };

  const columns = ["Customer & Dealer", "Feedback Subject", "Date", "Status", "Actions"];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface text-tmain flex items-center justify-center border border-surfaceBorder font-bold text-sm shadow-sm shrink-0">
            {item.customer.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-tmain block">{item.customer}</span>
            <span className="text-xs text-tmuted">via {item.dealer}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 max-w-xs">
          <span className="text-sm font-bold text-tmain block">{item.feedback1}</span>
          <span className="text-xs text-tmuted truncate block overflow-hidden mt-0.5">{item.feedback2}</span>
      </td>
      <td className="px-6 py-4 text-tmuted font-medium text-sm whitespace-nowrap">{item.date}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
          item.status === 'replied' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {item.status === 'replied' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {item.status === 'replied' ? 'Replied' : 'Pending'}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button variant="secondary" className="px-3 py-1.5 bg-surface border-surfaceBorder text-tmuted hover:text-primary-500 hover:border-primary-500/30 text-xs whitespace-nowrap" onClick={() => handleReplyClick(item)}>
          <Reply size={14} className="mr-1.5" />
          {item.status === 'replied' ? 'Edit' : 'Reply'}
        </Button>
      </td>
    </>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">System Feedback</h1>
          <p className="text-sm text-tmuted mt-1">Review customer issues across your dealer network.</p>
        </div>
      </div>

      {/* Global Search and Filter */}
      <div className="glass p-4 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search feedback or dealerships..." 
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Feedback Table */}
      <Table 
        columns={columns} 
        data={feedbacks} 
        keyExtractor={(item) => item.id}
        renderRow={renderRow} 
      />

      {/* Reply Modal */}
      <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} title="System Admin Response">
        {selectedFeedback && (
          <form className="space-y-6" onSubmit={handleSaveReply}>
            <div className="p-4 bg-surface/50 rounded-2xl border border-surfaceBorder mb-6 relative">
              <span className="text-xs font-bold text-tmuted uppercase">Original Feedback Reference</span>
              <p className="text-tmain mt-1 border-l-2 border-primary-500 pl-3 ml-1 text-sm">{selectedFeedback.feedback2}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-tmuted">Your Action / Suggestion</label>
              <textarea 
                rows={5} 
                className="w-full px-4 py-3 glass-input text-sm font-medium resize-none shadow-inner" 
                placeholder="Type your reply to the customer / dealer here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-surfaceBorder/50 mt-8">
              <Button type="button" variant="ghost" onClick={() => setIsReplyModalOpen(false)}>Cancel</Button>
              <Button type="submit">Publish Reply</Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
