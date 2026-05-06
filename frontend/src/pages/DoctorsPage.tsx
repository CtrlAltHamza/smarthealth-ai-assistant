import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating: number;
  user: { id: string; name: string; avatar?: string; email?: string };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Doctors</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Browse available doctors and book a consultation.</p>

      {loading && <div>Loading doctors…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 12 }}>
        {doctors.map((d) => (
          <div key={d.id} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 28 }}>{d.user.avatar || '👨‍⚕️'}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{d.user.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{d.specialization} • {d.experience} yrs</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>₹{d.consultationFee}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/doctors/${d.id}`)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent' }}>View</button>
                <button onClick={() => navigate('/book-appointment', { state: { doctorId: d.id } })} style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--gradient-main)', color: '#fff', border: 'none' }}>Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
