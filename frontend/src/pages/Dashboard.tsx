import { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress, Button, LinearProgress } from '@mui/material';
import { MonitorHeart, EventNote, Assignment, TrendingUp, AddBox, Psychology } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

const StatCard = ({ icon, title, value, color }: { icon: any; title: string; value: string | number; color: string }) => (
  <Box className="glass-panel" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 200px' }}>
    <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  </Box>
);

const Dashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [apptData, recData] = await Promise.all([
          apiRequest<any[]>(`/appointments/patient/${user.id}`, { token }),
          apiRequest<any[]>(`/admin/health-records/${user.id}`, { token }),
        ]);
        setAppointments(Array.isArray(apptData) ? apptData : []);
        setHealthRecords(Array.isArray(recData) ? recData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  const upcoming = appointments.filter((a: any) => a.status === 'Scheduled');
  const severityColor = (s: string) => s === 'high' ? 'error' : s === 'medium' ? 'warning' : 'success';

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" className="text-gradient" sx={{ mb: 0.5 }}>
        Welcome, {user?.firstName || 'Patient'}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your personal health dashboard
      </Typography>

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
        <StatCard icon={<EventNote fontSize="inherit" />} title="Upcoming Appointments" value={upcoming.length} color="#0070f3" />
        <StatCard icon={<MonitorHeart fontSize="inherit" />} title="Health Checks" value={healthRecords.length} color="#00dfd8" />
        <StatCard icon={<Assignment fontSize="inherit" />} title="Total Appointments" value={appointments.length} color="#7928ca" />
        <StatCard icon={<TrendingUp fontSize="inherit" />} title="High Severity Alerts" value={healthRecords.filter((r: any) => r.severity === 'high').length} color="#ff4444" />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>⚡ Quick Actions</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<AddBox />} 
            onClick={() => navigate('/appointments')}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Book Appointment
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            startIcon={<Psychology />} 
            onClick={() => navigate('/symptoms')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, color: '#000' }}
          >
            Analyze Symptoms
          </Button>
        </Box>
      </Box>

      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            {/* Upcoming Appointments */}
            <Box className="glass-panel" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>📅 Upcoming Appointments</Typography>
              {upcoming.length === 0 ? (
                <Typography color="text.secondary">
                  No upcoming appointments.{' '}
                  <Box component="span" sx={{ color: '#0070f3', cursor: 'pointer' }} onClick={() => navigate('/appointments')}>
                    Book one →
                  </Box>
                </Typography>
              ) : upcoming.slice(0, 3).map((a: any) => (
                <Box key={a.id} sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontWeight: 600 }}>
                    Dr. {a.Doctor?.Profile?.firstName} {a.Doctor?.Profile?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(a.appointmentDate).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 300px' }}>
            {/* Recent Health Checks */}
            <Box className="glass-panel" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>🩺 Recent Symptom Checks</Typography>
              {healthRecords.length === 0 ? (
                <Typography color="text.secondary">
                  No symptom checks yet.{' '}
                  <Box component="span" sx={{ color: '#00dfd8', cursor: 'pointer' }} onClick={() => navigate('/symptoms')}>
                    Check symptoms →
                  </Box>
                </Typography>
              ) : healthRecords.slice(0, 3).map((r: any) => (
                <Box key={r.id} sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '70%' }}>
                      "{r.reportedSymptoms?.slice(0, 60)}..."
                    </Typography>
                    <Chip label={r.severity} color={severityColor(r.severity) as any} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 300px' }}>
            {/* Health Profile & Tips */}
            <Box className="glass-panel" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>💡 Health Tips</Typography>
              <Box sx={{ p: 2, background: 'rgba(0,223,216,0.1)', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#00dfd8' }}>
                  <strong>Tip of the day:</strong> Stay hydrated! Drinking at least 8 glasses of water a day helps maintain energy levels and supports immune function.
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 'auto' }}>Profile Completeness</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress variant="determinate" value={60} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                <Typography variant="body2" color="text.secondary">60%</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Add your medical history to improve AI accuracy.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
