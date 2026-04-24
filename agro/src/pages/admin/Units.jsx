import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Save, Scale, Check, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormInput from "../../components/ui/FormInput";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import { 
  useGetUnitsMutation, 
  useCreateOrUpdateUnitMutation, 
  useDeleteUnitMutation, 
  useChangeUnitStatusMutation 
} from "../../redux/api/unitApi";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);
  
  const [formData, setFormData] = useState({
    type: "",
    sequence: ""
  });

  const [getUnits, { isLoading: isFetching }] = useGetUnitsMutation();
  const [createOrUpdateUnit, { isLoading: isSaving }] = useCreateOrUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [changeStatus] = useChangeUnitStatusMutation();

  const fetchUnits = async () => {
    try {
      const result = await getUnits({
        page: 1,
        limit: 100,
        search: searchQuery,
        sortfield: "_id",
        sortoption: 1
      }).unwrap();
      if (result.IsSuccess) {
        setUnits(result.Data.docs || []);
      }
    } catch (err) {
      console.error("Failed to fetch units:", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [searchQuery]);

  const handleOpenModal = (unit = null) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData({
        type: unit.type,
        sequence: unit.sequence || ""
      });
    } else {
      setEditingUnit(null);
      setFormData({
        type: "",
        sequence: units.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        unitid: editingUnit ? editingUnit._id : "",
        ...formData
      };
      const result = await createOrUpdateUnit(payload).unwrap();
      if (result.IsSuccess) {
        setIsModalOpen(false);
        fetchUnits();
      }
    } catch (err) {
      console.error("Failed to save unit:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await deleteUnit({ unitid: id }).unwrap();
        fetchUnits();
      } catch (err) {
        console.error("Failed to delete unit:", err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await changeStatus({ unitid: id }).unwrap();
      fetchUnits();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight font-sans">Measurement Units</h1>
          <p className="text-sm text-tmuted mt-1">Define units like KG, Litre, Packet etc. for products.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-md px-6 py-2">
          <Plus size={18} />
          <span>Add Unit</span>
        </Button>
      </div>

      <div className="bg-surface p-4 border border-surfaceBorder rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tmuted group-focus-within:text-form-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surfaceBorder rounded-[4px] text-sm focus:border-form-primary focus:ring-4 focus:ring-form-primary/10 outline-none text-tmain placeholder:text-tmuted transition-all shadow-sm"
          />
        </div>
      </div>

      <Table 
        columns={["Sequence", "Unit Type", "Status", "Actions"]} 
        data={units} 
        keyExtractor={(item) => item._id}
        renderRow={(unit) => (
          <>
            <td className="px-6 py-4">
              <span className="text-xs font-bold text-tmuted">#{unit.sequence}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg border border-primary-500/20">
                  <Scale size={16} />
                </div>
                <span className="font-bold text-tmain text-sm uppercase">{unit.type}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => handleToggleStatus(unit._id)}
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
                  unit.status 
                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
              >
                {unit.status ? "Active" : "Inactive"}
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(unit)}
                  className="p-1.5 text-tmuted hover:text-form-primary bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(unit._id)}
                  className="p-1.5 text-tmuted hover:text-red-400 bg-surface/50 hover:bg-surface rounded border border-transparent hover:border-surfaceBorder shadow-sm transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUnit ? "Edit Unit" : "Add New Unit"}
        className="max-w-md"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput 
            label="Unit Type" 
            placeholder="e.g. KG, LTR, PKT" 
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required 
          />
          <FormInput 
            label="Display Sequence" 
            type="number"
            value={formData.sequence}
            onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
            required 
          />

          <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-surfaceBorder/50">
            <Button type="button" variant="ghost" className="rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-md px-10 shadow-lg shadow-form-primary/20 py-2.5">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              {editingUnit ? "Update Unit" : "Create Unit"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
