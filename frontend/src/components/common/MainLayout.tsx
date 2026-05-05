import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import type { RootState } from "../../store";

const NAV = [
  { to: "/dashboard",        icon: "⬡",  label: "Dashboard"       },
  { to: "/symptom-checker",  icon: "🔬", label: "Symptom Checker" },
  { to: "/appointments",     icon: "📅", label: "Appointments"    },
  { to: "/doctors",          icon: "👨‍⚕️", label: "Doctors"         },
  { to: "/profile",          icon: "👤", label: "My Profile"      },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* ─── Sidebar ─────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 68 : 240, flexShrink: 0, transition: "width 0.3s ease",
        background: "var(--bg-secondary)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 16px 20px", borderBottom: "1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:"var(--gradient-main)", display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, fontWeight:700, color:"#fff",
          }}>S</div>
          {!collapsed && <span style={{ fontSize:16, fontWeight:700, background:"var(--gradient-main)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SmartHealth</span>}
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"16px 8px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:12,
              padding: collapsed ? "12px 16px" : "11px 14px",
              borderRadius:"var(--radius-md)", textDecoration:"none",
              fontSize:14, fontWeight:500, transition:"var(--transition)",
              color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
              background: isActive ? "rgba(56,189,248,0.08)" : "transparent",
              border: isActive ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
            })}>
              <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink to="/admin" style={({ isActive }) => ({
              display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
              borderRadius:"var(--radius-md)", textDecoration:"none", marginTop:8,
              fontSize:14, fontWeight:500, transition:"var(--transition)",
              color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)",
              background: isActive ? "rgba(129,140,248,0.08)" : "transparent",
              border: isActive ? "1px solid rgba(129,140,248,0.15)" : "1px solid transparent",
            })}>
              <span style={{ fontSize:18, flexShrink:0 }}>🛡️</span>
              {!collapsed && <span>Admin Panel</span>}
            </NavLink>
          )}
        </nav>

        {/* User + logout */}
        <div style={{ padding:"16px 8px", borderTop:"1px solid var(--border)" }}>
          {!collapsed && (
            <div style={{ padding:"10px 12px", borderRadius:"var(--radius-md)", background:"var(--bg-hover)", marginBottom:8 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
              <div style={{ fontSize:11, color:"var(--text-muted)", textTransform:"capitalize" }}>{user?.role}</div>
            </div>
          )}
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width:"100%", justifyContent: collapsed ? "center" : "flex-start", padding:"10px 14px", fontSize:13 }}>
            <span>🚪</span>{!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* ─── Main content ─────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto" }}>
        {/* Topbar */}
        <header style={{
          height:60, background:"var(--bg-secondary)", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", padding:"0 24px", gap:16,
          position:"sticky", top:0, zIndex:100,
        }}>
          <button onClick={() => setCollapsed(c => !c)} className="btn btn-ghost" style={{ padding:"8px", fontSize:18 }}>☰</button>
          <div style={{ flex:1 }} />
          <div style={{ fontSize:13, color:"var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
          </div>
          <div style={{
            width:34, height:34, borderRadius:"50%", background:"var(--gradient-main)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff",
          }}>{user?.name?.[0]?.toUpperCase()}</div>
        </header>

        <main style={{ flex:1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
