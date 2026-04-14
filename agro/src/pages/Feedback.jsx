import { useState } from "react";
import { MessageSquare, Plus, Search, Reply, CheckCircle2, Clock } from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([
    { 
      id: 1, 
      customer: "Suresh Singh", 
      date: "Oct 24, 2026",
      feedback1: "Quality of DAP Fertilizer", // First feedback field (e.g., Subject/Product)
      feedback2: "The recent batch of DAP fertilizer is clumping together due to moisture. Need better packaging.", // Second feedback field (e.g., Detail/Comment)
      status: "replied",
      reply: "We apologize for the inconvenience. We have escalated this to the packaging team and will replace your affected stock immediately."
    },
    { 
      id: 2, 
      customer: "Mukesh Kumar", 
      date: "Oct 22, 2026",
      feedback1: "Delivery Delay",
      feedback2: "The tomato seeds were delivered 3 days late during peak sowing season.",
      status: "pending",
      reply: null
    }
  ]);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Customer Feedback</h1>
          <p className="text-sm text-tmuted mt-1">Manage reviews, issues, and provide suggestions.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>New Feedback</span>
        </Button>
      </div>

      {/* Global Search and Filter */}
      <div className="glass p-4 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feedbacks or customers..." 
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-surfaceBorder rounded-2xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-tmain placeholder:text-tmuted transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {feedbacks
          .filter(f => 
            f.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.feedback1.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.feedback2.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-surfaceBorder/50 shadow-lg relative overflow-hidden group">
            {/* Status indicator line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${item.status === 'replied' ? 'bg-gradient-to-r from-emerald-500 to-primary-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'}`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-surface text-tmain flex items-center justify-center border border-surfaceBorder font-bold text-lg shadow-sm">
                  {item.customer.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-tmain">{item.customer}</h3>
                  <p className="text-sm text-tmuted">{item.date}</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                item.status === 'replied' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {item.status === 'replied' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {item.status === 'replied' ? 'Replied' : 'Pending'}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-surface/50 p-4 rounded-2xl border border-surfaceBorder space-y-3">
                <div>
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1 block">Feedback 1 (Subject)</span>
                  <p className="text-tmain font-medium">{item.feedback1}</p>
                </div>
                <div className="h-px w-full bg-surfaceBorder" />
                <div>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">Feedback 2 (Details)</span>
                  <p className="text-tmuted text-sm leading-relaxed">{item.feedback2}</p>
                </div>
              </div>

              {item.reply && (
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex gap-3 items-start relative">
                  <div className="absolute -left-2 top-6 w-4 h-px bg-emerald-500/30" />
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500 shrink-0 mt-1">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1 dark:text-emerald-400">Your Suggestion / Reply</span>
                    <p className="text-emerald-700 text-sm leading-relaxed dark:text-emerald-100/80">{item.reply}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-surfaceBorder/50 flex justify-end">
              <Button variant="secondary" className="hover:bg-primary-500/10 bg-surface border-surfaceBorder text-tmuted hover:text-primary-500 hover:border-primary-500/30" onClick={() => handleReplyClick(item)}>
                <Reply size={16} className="mr-2" />
                {item.status === 'replied' ? 'Edit Reply' : 'Send Suggestion'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} title="Feedback Suggestion & Reply">
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
                placeholder="Type your reply to the customer here..."
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

      {/* Add New Feedback Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Record New Feedback">
        <form className="space-y-5" onSubmit={(e) => { 
          e.preventDefault(); 
          setIsAddModalOpen(false); 
        }}>
          <FormInput label="Customer Name" placeholder="e.g. Ramesh Singh" required />
          <FormInput label="Feedback 1 (Subject / Product)" placeholder="e.g. Delivery Quality" required />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-tmuted">Feedback 2 (Detailed Notes)</label>
            <textarea 
              rows={4} 
              className="w-full px-4 py-3 glass-input text-sm font-medium resize-none" 
              placeholder="Detailed description..."
              required
            ></textarea>
          </div>
          
          <div className="pt-6 flex items-center justify-end gap-3 mt-8 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Feedback</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
