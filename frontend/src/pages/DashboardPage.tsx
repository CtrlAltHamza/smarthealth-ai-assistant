import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import api from "../services/api";

const StatCard = ({ icon, label, value, delta, color }: any) => (
  <div className="card fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div style={{ width:44, height:44, borderRadius:12, background:`rgba(${color},0.12)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
      {delta && <span className={`badge ${delta > 0 ? "badge-green" : "badge-red"}`}>{delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%</span>}
    </div>
    <div>
      <div style={{ fontSize:30, fontWeight:700, letterSpacing:"-1px" }}>{value}</div>
      <div style={{ fontSize:13, color:"var(--text-secondary)", marginTop:2 }}>{label}</div>
    </div>
  </div>
);

const AppointmentRow = ({ apt }: any) => (
  <div style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 0", borderBottom:"1px solid var(--border)" }}>
    <div style={{ width:40, height:40, borderRadius:10, background:"var(--gradient-main)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#fff", fontSize:14, flexShrink:0 }}>
      {apt.doctor?.[0] || "D"}
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontWeight:500, fontSize:14 }}>{apt.doctor || "Dr. Unknown"}</div>
      <div style={{ fontSize:12, color:"var(--text-secondary)" }}>{apt.type} — {apt.time}</div>
    </div>
    <span className={`badge ${apt.status === "confirmed" ? "badge-green" : apt.status === "pending" ? "badge-orange" : "badge-blue"}`}>
      {apt.status}
    </span>
  </div>
);

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [stats] = useState({ appointments: 12, predictions: 8, doctors: 3, records: 24 });
  const [recentApts] = useState([
    { doctor:"Dr. Sarah Ahmed", type:"video", time:"Today 2:00 PM", status:"confirmed" },
    { doctor:"Dr. Ali Hassan",  type:"in-person", time:"Tomorrow 10:30 AM", status:"pending" },
    { doctor:"Dr. Maria Khan",  type:"phone", time:"Thu 4:00 PM", status:"confirmed" },
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom:32 }} className="fade-in">
        <h1 className="page-title">{greeting}, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="page-subtitle">Here's what's happening with your health today.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom:28 }}>
        <StatCard icon="📅" label="Total Appointments" value={stats.appointments} delta={12}  color="56,189,248" />
        <StatCard icon="🔬" label="AI Analyses"        value={stats.predictions}  delta={8}   color="129,140,248" />
        <StatCard icon="👨‍⚕️" label="Doctors Consulted"  value={stats.doctors}     delta={null} color="52,211,153" />
        <StatCard icon="📋" label="Medical Records"    value={stats.records}      delta={5}   color="251,146,60" />
      </div>

      {/* Main content grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
        {/* Upcoming appointments */}
        <div className="card fade-in-2">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:600 }}>Upcoming Appointments</h3>
            <a href="/appointments" style={{ fontSize:13, color:"var(--accent-primary)", textDecoration:"none" }}>View all →</a>
          </div>
          {recentApts.map((apt, i) => <AppointmentRow key={i} apt={apt} />)}
        </div>

        {/* Quick actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card fade-in-2">
            <h3 style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>Quick Actions</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { href:"/symptom-checker", icon:"🔬", label:"Check Symptoms",    desc:"AI-powered analysis",    color:"56,189,248" },
                { href:"/book-appointment", icon:"✅", label:"Book Appointment",  desc:"Schedule a consultation", color:"251,146,60" },
                { href:"/doctors",         icon:"👨‍⚕️", label:"Browse Doctors",   desc:"500+ specialists",      color:"129,140,248" },
              ].map(({ href, icon, label, desc, color }) => (
                <a key={href} href={href} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                  borderRadius:"var(--radius-md)", textDecoration:"none",
                  background:"var(--bg-hover)", border:"1px solid var(--border)", transition:"var(--transition)",
                }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:`rgba(${color},0.15)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{label}</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)" }}>{desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Health tip */}
          <div className="card fade-in-3" style={{ background:"linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))", borderColor:"var(--border-strong)" }}>
            <div style={{ fontSize:24, marginBottom:8 }}>💡</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>Health Tip of the Day</div>
            <div style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.6 }}>
              Staying hydrated improves cognitive performance by up to 30%. Aim for 8 glasses of water daily.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
