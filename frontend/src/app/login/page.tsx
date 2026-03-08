"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");

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
      <div className="glass-card w-full max-w-md p-8 animate-float">
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
                className="premium-input pl-11"
                placeholder="name@company.com"
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
                type="password"
                className="premium-input pl-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="premium-button w-full flex items-center justify-center gap-2 group">
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Demo Access:</p>
            <p>Email: admin@test.com</p>
            <p>Password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}