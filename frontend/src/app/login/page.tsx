"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@test.com" && password === "123456") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials. Use the demo account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[8px] bg-indigo-100 text-indigo-600 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Secure Access</h1>
          <p className="text-slate-500 mt-2">PDF Extraction Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="email"
                className="premium-input pl-10"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="premium-input pl-10 pr-12"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between ml-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-slate-400 bg-white'}`}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {rememberMe && <Check size={12} className="text-white" />}
              </div>
              <span className="text-[11px] font-medium text-slate-600">Remember Me</span>
            </label>
            <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="premium-button !px-10 !py-2.5 !h-11 flex items-center justify-center gap-2 group !text-xs !font-bold">
              Login
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>


      </div>
    </div>
  );
}