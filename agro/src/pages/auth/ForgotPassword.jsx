import { ArrowLeft, KeyRound, Leaf, Mail } from "lucide-react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await forgotPassword({ email }).unwrap();
      setMessage("Password reset instructions have been sent to your email.");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
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
            <Link to="/login" className="w-10 h-10 rounded-xl bg-surface border border-surfaceBorder flex items-center justify-center hover:bg-primary-500/10 hover:border-primary-500/50 transition-all">
              <ArrowLeft size={20} className="text-tmuted" />
            </Link>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Leaf className="text-tmain outline-none" size={24} />
              </div>
              <span className="font-bold text-2xl text-tmain tracking-tight">Agro</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
              <KeyRound size={32} className="text-primary-500" />
            </div>
            <h1 className="text-4xl font-black text-tmain tracking-tight mb-2">Forgot Password?</h1>
            <p className="text-tmuted font-medium">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput 
              type="email" 
              label="Email Address" 
              placeholder="raj.kalsariya1994@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} className="text-tmuted" />}
              required 
            />

            <Button type="submit" disabled={isLoading} className="w-full py-4 text-base mt-4 group">
              <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
            </Button>
          </form>

          <p className="text-sm font-medium text-tmuted mt-8 text-center italic">
            Remembered your password? <Link to="/login" className="text-primary-500 font-bold hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
