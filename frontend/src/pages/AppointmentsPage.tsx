import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  duration: number;
  type: string;
  reason: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Appointments</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Your upcoming and past appointments.</p>

      {loading && <div>Loading appointments…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'grid', gap: 10 }}>
        {appointments.map((a) => (
          <div key={a.id} style={{ padding: 12, borderRadius: 8, background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{a.reason}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(a.scheduledAt).toLocaleString()} • {a.type} • {a.duration} mins</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{a.status}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.doctorId}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
