import { Trash2, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName, title = "Confirm Deletion", loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Warning Icon with Pulsing Effect */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2 relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-25" />
          <Trash2 size={28} className="relative z-10" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-tmain">Are you absolutely sure?</h4>
          <p className="text-sm text-tmuted leading-relaxed">
            This action cannot be undone. This will permanently delete 
            <span className="text-tmain font-bold px-1.5 py-0.5 mx-1 rounded bg-surface border border-surfaceBorder">
              {itemName || "this item"}
            </span> 
            and all associated data from our servers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-6">
          <Button 
            variant="ghost" 
            className="flex-1 rounded-xl py-3 border border-surfaceBorder" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            className="flex-1 rounded-xl py-3 bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" 
            onClick={onConfirm}
            disabled={loading}
          >
            <Trash2 size={16} />
            <span>{loading ? "Deleting..." : "Delete Item"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
