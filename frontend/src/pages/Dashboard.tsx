import { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  LinearProgress,
  Grid,
  Container,
} from '@mui/material';
import {
  MonitorHeart,
  EventNote,
  Assignment,
  TrendingUp,
  AddBox,
  Psychology,
  ChevronRight,
  LightbulbCircle,
  PictureAsPdf,
  ShowChart,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';
import '../lib/chartSetup';

const chartColors = {
  primary: 'rgba(0, 112, 243, 0.85)',
  accent: 'rgba(0, 223, 216, 0.85)',
  purple: 'rgba(121, 40, 202, 0.85)',
  grid: 'rgba(255,255,255,0.06)',
  text: '#8b949e',
};

const StatCard = ({
  icon,
  title,
  value,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ flex: '1 1 200px' }}
  >
    <Box
      className="glass-card"
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        height: '100%',
      }}
    >
      <Box
        sx={{
          color,
          background: `${color}18`,
          p: 1.5,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </motion.div>
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
  const highSeverity = healthRecords.filter((r: any) => r.severity === 'high').length;

  const profileCompleteness = useMemo(() => {
    let score = 35;
    if (user?.firstName) score += 25;
    if (healthRecords.length > 0) score += Math.min(30, healthRecords.length * 6);
    if (appointments.length > 0) score += 10;
    return Math.min(100, score);
  }, [user, healthRecords.length, appointments.length]);

  const lineData = useMemo(() => {
    const byDay: Record<string, number> = {};
    [...healthRecords]
      .sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .forEach((r) => {
        const d = new Date(r.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        byDay[d] = (byDay[d] || 0) + 1;
      });
    const labels = Object.keys(byDay);
    const data = labels.map((k) => byDay[k]);
    if (labels.length === 0) {
      return {
        labels: ['No data yet'],
        datasets: [
          {
            label: 'AI check-ins',
            data: [0],
            borderColor: chartColors.primary,
            backgroundColor: 'rgba(0, 112, 243, 0.15)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }
    return {
      labels,
      datasets: [
        {
          label: 'AI check-ins',
          data,
          borderColor: chartColors.primary,
          backgroundColor: 'rgba(0, 112, 243, 0.12)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [healthRecords]);

  const barData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    healthRecords.forEach((r: any) => {
      const s = r.severity as keyof typeof counts;
      if (s in counts) counts[s]++;
    });
    return {
      labels: ['Low', 'Medium', 'High'],
      datasets: [
        {
          label: 'Severity',
          data: [counts.low, counts.medium, counts.high],
          backgroundColor: [
            'rgba(0, 223, 216, 0.7)',
            'rgba(255, 193, 7, 0.75)',
            'rgba(244, 67, 54, 0.75)',
          ],
          borderRadius: 8,
        },
      ],
    };
  }, [healthRecords]);

  const doughnutData = useMemo(() => {
    const s = { Scheduled: 0, Completed: 0, Cancelled: 0 };
    appointments.forEach((a: any) => {
      if (a.status in s) s[a.status as keyof typeof s]++;
    });
    return {
      labels: ['Scheduled', 'Completed', 'Cancelled'],
      datasets: [
        {
          data: [s.Scheduled, s.Completed, s.Cancelled],
          backgroundColor: [
            'rgba(0, 112, 243, 0.85)',
            'rgba(0, 223, 216, 0.85)',
            'rgba(244, 67, 54, 0.75)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [appointments]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: chartColors.text },
        },
      },
      scales: {
        x: {
          ticks: { color: chartColors.text },
          grid: { color: chartColors.grid },
        },
        y: {
          ticks: { color: chartColors.text },
          grid: { color: chartColors.grid },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: chartColors.text },
          grid: { display: false },
        },
        y: {
          ticks: { color: chartColors.text, stepSize: 1 },
          grid: { color: chartColors.grid },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: { color: chartColors.text, padding: 16 },
        },
      },
    }),
    []
  );

  const exportPdf = () => {
    if (!user) return;
    const doc = new jsPDF();
    const line = (y: number, text: string) => {
      doc.text(text, 14, y);
      return y + 7;
    };
    let y = 20;
    doc.setFontSize(16);
    y = line(y, 'SmartHealth — Personal Health Summary');
    doc.setFontSize(10);
    y = line(y, `Patient: ${user.firstName || ''} ${user.lastName || ''} (${user.email})`);
    y = line(y, `Generated: ${new Date().toLocaleString()}`);
    y += 5;
    doc.setFontSize(12);
    y = line(y, 'Visit & AI activity');
    doc.setFontSize(10);
    y = line(y, `Total appointments: ${appointments.length}`);
    y = line(y, `Upcoming scheduled: ${upcoming.length}`);
    y = line(y, `AI symptom analyses: ${healthRecords.length}`);
    y = line(y, `High-severity flags: ${highSeverity}`);
    y += 4;
    doc.setFontSize(12);
    y = line(y, 'Recent AI checks (latest 5)');
    doc.setFontSize(9);
    healthRecords.slice(0, 5).forEach((r: any) => {
      const snippet = (r.reportedSymptoms || '').slice(0, 90);
      y = line(y, `• ${new Date(r.createdAt).toLocaleDateString()} — ${r.severity} — ${snippet}`);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(120);
    line(
      y,
      'Disclaimer: For informational use only. Not a medical diagnosis. Consult a licensed clinician.'
    );
    doc.save(`smarthealth-report-${user.id}.pdf`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        background:
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,112,243,0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(121,40,202,0.08), transparent)',
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Patient <span className="text-gradient">Dashboard</span>
              </Typography>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 560 }}>
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}. Track symptoms, visits, and AI insights in one place.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={exportPdf}
              sx={{
                borderColor: 'var(--glass-border)',
                color: 'var(--text-vibrant)',
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': { borderColor: 'var(--primary)', background: 'rgba(0,112,243,0.08)' },
              }}
            >
              Export PDF
            </Button>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <StatCard icon={<EventNote />} title="Upcoming" value={upcoming.length} color="#0070f3" delay={0.05} />
          <StatCard icon={<MonitorHeart />} title="AI analyses" value={healthRecords.length} color="#00dfd8" delay={0.1} />
          <StatCard icon={<Assignment />} title="All visits" value={appointments.length} color="#7928ca" delay={0.15} />
          <StatCard icon={<TrendingUp />} title="High priority" value={highSeverity} color="#ff5252" delay={0.2} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <Box className="glass-card" sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ShowChart sx={{ color: 'var(--primary)' }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
                      Health analytics
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Box sx={{ height: 260 }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block', mb: 1 }}>
                          Symptom check-ins over time
                        </Typography>
                        <Line data={lineData} options={chartOptions} />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box sx={{ height: 260 }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block', mb: 1 }}>
                          Severity distribution
                        </Typography>
                        <Bar data={barData} options={barOptions} />
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <Box sx={{ height: 220, maxWidth: 400, mx: 'auto' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block', mb: 1, textAlign: 'center' }}>
                          Appointment mix
                        </Typography>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="glass-card" sx={{ height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Outfit', fontWeight: 700 }}>
                      Upcoming schedule
                    </Typography>
                    {upcoming.length === 0 ? (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: 'var(--text-dim)' }}>No pending appointments</Typography>
                        <Button sx={{ mt: 2 }} onClick={() => navigate('/appointments')}>
                          Book now
                        </Button>
                      </Box>
                    ) : (
                      upcoming.slice(0, 4).map((a: any) => (
                        <Box
                          key={a.id}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            Dr. {a.Doctor?.Profile?.firstName} {a.Doctor?.Profile?.lastName}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" sx={{ color: 'var(--primary)' }}>
                              {new Date(a.appointmentDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-dim)' }}>
                              {new Date(a.appointmentDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    )}
                    <Button fullWidth endIcon={<ChevronRight />} onClick={() => navigate('/appointments')} sx={{ mt: 1, color: 'var(--text-muted)' }}>
                      View all
                    </Button>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="glass-card" sx={{ height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Outfit', fontWeight: 700 }}>
                      Recent AI checks
                    </Typography>
                    {healthRecords.length === 0 ? (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: 'var(--text-dim)' }}>Run your first analysis</Typography>
                        <Button sx={{ mt: 2 }} onClick={() => navigate('/symptoms')}>
                          Symptom AI
                        </Button>
                      </Box>
                    ) : (
                      healthRecords.slice(0, 4).map((r: any) => (
                        <Box
                          key={r.id}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {r.reportedSymptoms}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-dim)' }}>
                              {new Date(r.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={r.severity}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              background:
                                r.severity === 'high'
                                  ? 'rgba(255,82,82,0.15)'
                                  : r.severity === 'medium'
                                    ? 'rgba(255,193,7,0.15)'
                                    : 'rgba(0,223,216,0.12)',
                              color:
                                r.severity === 'high'
                                  ? '#ff8a80'
                                  : r.severity === 'medium'
                                    ? '#ffe082'
                                    : '#00dfd8',
                            }}
                          />
                        </Box>
                      ))
                    )}
                    <Button fullWidth endIcon={<ChevronRight />} onClick={() => navigate('/symptoms')} sx={{ mt: 1, color: 'var(--text-muted)' }}>
                      New analysis
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box
                className="glass-card"
                sx={{ mb: 3, background: 'linear-gradient(145deg, rgba(0,112,243,0.08), transparent)' }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Outfit', fontWeight: 700 }}>
                  Quick actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    className="btn-premium"
                    type="button"
                    onClick={() => navigate('/appointments')}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <AddBox fontSize="small" /> Book appointment
                  </button>
                  <button
                    className="btn-premium"
                    type="button"
                    onClick={() => navigate('/symptoms')}
                    style={{
                      width: '100%',
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Psychology fontSize="small" /> Analyze symptoms
                  </button>
                </Box>
              </Box>

              <Box className="glass-card" sx={{ background: 'linear-gradient(145deg, rgba(0,223,216,0.06), transparent)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LightbulbCircle sx={{ color: 'var(--accent)' }} />
                  <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
                    Personalized insight
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7, mb: 2 }}>
                  Regular check-ins help our models spot patterns early. Aim for one symptom review when something feels off, and keep
                  hydration and sleep consistent.
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Profile strength
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={profileCompleteness}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, var(--primary), var(--accent))' },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {profileCompleteness}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
