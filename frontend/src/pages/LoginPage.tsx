import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useSelector((s: RootState) => s.auth);

  useEffect(() => { if (accessToken) navigate("/dashboard"); }, [accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"var(--bg-primary)", padding:24,
      backgroundImage:"radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,189,248,0.1), transparent), radial-gradient(ellipse 40% 40% at 80% 100%, rgba(129,140,248,0.08), transparent)",
    }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }} className="fade-in">
          <div style={{
            width:56, height:56, borderRadius:16, background:"var(--gradient-main)",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:26, fontWeight:800, color:"#fff", marginBottom:16,
            boxShadow:"0 8px 32px rgba(56,189,248,0.25)",
          }}>S</div>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>Welcome back</h1>
          <p style={{ color:"var(--text-secondary)", fontSize:14 }}>Sign in to your SmartHealth account</p>
        </div>

        <div className="card fade-in-2">
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {error && (
              <div style={{ padding:"12px 16px", borderRadius:"var(--radius-md)", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color:"var(--accent-red)", fontSize:14 }}>
                {error}
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ textAlign:"center", marginTop:20, fontSize:14, color:"var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"var(--accent-primary)", textDecoration:"none", fontWeight:500 }}>Create one</Link>
          </div>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop:20, padding:"14px 16px", borderRadius:"var(--radius-md)", background:"rgba(56,189,248,0.05)", border:"1px solid var(--border)", fontSize:13 }} className="fade-in-3">
          <div style={{ fontWeight:600, color:"var(--accent-primary)", marginBottom:6 }}>Demo Accounts</div>
          <div style={{ color:"var(--text-secondary)", display:"flex", flexDirection:"column", gap:3 }}>
            <span>Patient: <code style={{ fontFamily:"var(--font-mono)", color:"var(--text-primary)" }}>patient@demo.com / Demo1234!</code></span>
            <span>Doctor:  <code style={{ fontFamily:"var(--font-mono)", color:"var(--text-primary)" }}>doctor@demo.com  / Demo1234!</code></span>
            <span>Admin:   <code style={{ fontFamily:"var(--font-mono)", color:"var(--text-primary)" }}>admin@demo.com   / Demo1234!</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
