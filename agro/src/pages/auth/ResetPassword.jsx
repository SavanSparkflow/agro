import { Eye, EyeOff, Leaf, Lock, ShieldCheck } from "lucide-react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // In a real scenario, content and iv would come from URL or some logic
    // The user provided an example payload:
    // { "content": "...", "iv": "...", "password": "..." }
    const content = searchParams.get("content");
    const iv = searchParams.get("iv");

    if (!content || !iv) {
      setError("Invalid or expired reset link.");
      return;
    }

    try {
      await resetPassword({ content, iv, password }).unwrap();
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex text-theme-main bg-background">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md animate-fade-in relative">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Leaf className="text-tmain outline-none" size={24} />
            </div>
            <span className="font-bold text-2xl text-tmain tracking-tight">Agro</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-tmain tracking-tight mb-2">Reset Password</h1>
            <p className="text-tmuted font-medium">Create a strong new password for your account.</p>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <ShieldCheck size={18} />
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="form-label">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tmuted hover:text-tmain transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-4 text-base mt-4 group">
              <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
