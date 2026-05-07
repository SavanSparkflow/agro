import { User, Mail, Phone, MapPin, Shield, Edit2, ShieldAlert, Lock, Save, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword, updateUser, updateProfilePic } from "../redux/slices/authSlice";
import { useRef } from "react";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: isFetching } = useSelector((state) => state.auth);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        role: user.rolename || "User",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsUpdating(true);
    try {
      const result = await dispatch(updateProfile(formData)).unwrap();
      if (result.IsSuccess) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to update profile." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (passwordData.password !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setIsChanging(true);
    try {
      const result = await dispatch(changePassword({
        oldpassword: passwordData.oldpassword,
        password: passwordData.password
      })).unwrap();
      if (result.IsSuccess) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ oldpassword: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to change password." });
    } finally {
      setIsChanging(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilepic", file);

    setIsUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const result = await dispatch(updateProfilePic(formData)).unwrap();
      if (result.IsSuccess) {
        setMessage({ type: "success", text: "Profile picture updated successfully!" });
        // Update the user in state with the new pic URL if returned
        if (result.Data && result.Data.profilePic) {
          dispatch(updateUser({ profilePic: result.Data.profilePic }));
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to upload profile picture." });
    } finally {
      setIsUploading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Account Profile</h1>
          <p className="text-sm text-tmuted mt-1">Manage your personal information and preferences.</p>
        </div>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${message.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-surfaceBorder/50 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400" />

            <div className="relative w-32 h-32 rounded-full mb-6 mt-4 p-1 bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-sm shadow-primary-500/20">
              <div className="w-full h-full bg-surface rounded-full flex items-center justify-center overflow-hidden border-4 border-surfaceBorder">
                {isUploading ? (
                  <Loader2 size={30} className="text-primary-500 animate-spin" />
                ) : user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={50} className="text-tmuted" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-400 transition-colors shadow-sm border-2 border-surfaceBorder group disabled:opacity-50"
              >
                <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-tmain text-center">{user?.name || "Admin"}</h2>
            <p className="text-sm font-medium text-tmuted mt-1 flex items-center gap-2">
              <Shield size={14} className="text-primary-500" /> {user?.rolename || "Administrator"}
            </p>

            {/* <div className="w-full mt-8 space-y-4">
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <Mail size={18} className="text-tmuted/70" />
                <span className="truncate">{user?.email || "admin@pureyou.com"}</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <Phone size={18} className="text-tmuted/70" />
                <span>{user?.mobile || "+91 12345 67890"}</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-tmuted bg-surface/40 p-3 rounded-xl border border-surfaceBorder/50">
                <MapPin size={18} className="text-tmuted/70" />
                <span>{user?.address || "No address provided"}</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right column: Edit Details & Change Password */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 border-surfaceBorder/50">
            <h3 className="text-xl font-bold text-tmain mb-6 pb-4 border-b border-surfaceBorder/50 flex items-center gap-2">
              <User size={20} className="text-primary-500" />
              Personal Information
            </h3>

            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <FormInput
                  label="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUpdating} className="px-8 shadow-sm shadow-primary-500/20">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-8 border-surfaceBorder/50">
            <h3 className="text-xl font-bold text-tmain mb-6 pb-4 border-b border-surfaceBorder/50 flex items-center gap-2">
              <Lock size={20} className="text-primary-500" />
              Security & Password
            </h3>

            <form className="space-y-6" onSubmit={handleChangePassword}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.oldpassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldpassword: e.target.value })}
                />
                <FormInput
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                />
                <FormInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isChanging} variant="secondary" className="px-8">
                  {isChanging ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock size={18} className="mr-2" />}
                  Change Password
                </Button>
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
