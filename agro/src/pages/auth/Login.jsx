import { ArrowRight, Eye, EyeOff, Leaf, ShieldCheck, Sprout } from "lucide-react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApi";
import { setCredentials } from "../../redux/slices/authSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (err) {
      setError(err?.data?.Message || err?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex text-theme-main bg-background">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md animate-fade-in relative">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Leaf className="text-tmain outline-none" size={24} />
            </div>
            <span className="font-bold text-2xl text-tmain tracking-tight">Agro</span>
          </div>

          <h1 className="text-4xl font-black text-tmain tracking-tight mb-2">Welcome Back</h1>
          <p className="text-tmuted font-medium mb-10">Sign in to your Agro ERP dashboard.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput 
              type="text" 
              label="Username" 
              placeholder="admin@pureyou.com" 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required 
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" size={14} className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors dark:text-primary-400 dark:hover:text-primary-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <Button type="submit" disabled={isLoading} className="w-full py-4 text-base mt-4 group">
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="text-sm font-medium text-tmuted mt-8 text-center sm:text-left italic">
            Don't have an account? Please contact your administrator for credentials.
          </p>
        </div>
      </div>

      {/* Right Branding Section */}
      <div className="hidden lg:flex w-1/2 relative bg-surface border-l border-surfaceBorder overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-background to-background z-10 opacity-60 dark:opacity-100" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Abstract pattern grid */}
        <div className="absolute inset-0 opacity-[0.03] z-0" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--text-main) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-20 flex flex-col justify-between h-full p-20 w-full animate-slide-up">
          <div className="glass-card rounded-3xl p-8 max-w-lg border-primary-500/20 bg-surface/50">
            <div className="flex gap-4 items-start mb-6">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                <Sprout size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-tmain mb-2">Modern Agriculture ERP</h3>
                <p className="text-sm text-tmuted leading-relaxed">
                  Streamline your dealership inventory, track stock intelligently, and generate custom invoices instantly. Built for the modern agricultural ecosystem.
                </p>
              </div>
            </div>
            
            <div className="border-t border-surfaceBorder pt-6 mt-6 flex gap-4 items-start">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-tmain mb-2">Secure & Reliable</h3>
                <p className="text-sm text-tmuted leading-relaxed">
                  Bank-grade security standards with encrypted transactions keeping your business data private and safe.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl font-black text-tmain leading-tight">
              Grow Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400">Business Faster.</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
