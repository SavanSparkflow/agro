import { User, Mail, Phone, MapPin, Shield, Edit2, ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";

export default function Profile() {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Account Profile</h1>
          <p className="text-sm text-tmuted mt-1">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-surfaceBorder/50 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400" />
            
            <div className="relative w-32 h-32 rounded-full mb-6 mt-4 p-1 bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-sm shadow-primary-500/20">
              <div className="w-full h-full bg-surface rounded-full flex items-center justify-center overflow-hidden border-4 border-surfaceBorder">
                <User size={50} className="text-tmuted" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-400 transition-colors shadow-sm border-2 border-surfaceBorder group">
                <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-tmain text-center">Ramesh Kumar</h2>
            <p className="text-sm font-medium text-tmuted mt-1 flex items-center gap-2">
              <Shield size={14} className="text-primary-500" /> Authorized Dealer
            </p>
            
            <div className="w-full mt-8 space-y-4">
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <Mail size={18} className="text-tmuted/70" />
                <span className="truncate">ramesh@agro.in</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <Phone size={18} className="text-tmuted/70" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <MapPin size={18} className="text-tmuted/70" />
                <span>Palampur, HP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Edit Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-surfaceBorder/50">
            <h3 className="text-xl font-bold text-tmain mb-6 pb-4 border-b border-surfaceBorder/50">Personal Information</h3>
            
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="First Name" defaultValue="Ramesh" />
                <FormInput label="Last Name" defaultValue="Kumar" />
                <FormInput label="Email Address" type="email" defaultValue="ramesh@agro.in" />
                <FormInput label="Mobile Number" type="tel" defaultValue="+91 98765 43210" />
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-tmuted">Complete Address</label>
                  <textarea rows={3} defaultValue="12 Agriculture Supply Market, Phase 1, Palampur, HP 176061" className="w-full px-4 py-3 glass-input text-sm font-medium resize-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="px-8 shadow-sm shadow-primary-500/20">Save Changes</Button>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-8 border-red-500/20 bg-gradient-to-br from-surface to-red-900/10">
            <h3 className="text-xl font-bold text-tmain mb-2 flex items-center gap-3">
              <ShieldAlert className="text-red-500" /> Danger Zone
            </h3>
            <p className="text-sm font-medium text-tmuted mb-6">Permanently delete your account and all associated data inside Agro ERP.</p>
            
            <Button variant="danger">
              Deactivate Account
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
