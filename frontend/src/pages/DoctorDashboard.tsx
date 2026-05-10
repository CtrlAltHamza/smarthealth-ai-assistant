import { useState, useEffect } from 'react';
import {
  Box, Typography, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider
} from '@mui/material';
import { Event, PersonOutlined, PendingActions } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

const DoctorDashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await apiRequest<any[]>(`/admin/doctor-appointments/${user.id}`, { token });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [user]);

  const updateStatus = async (appointmentId: number, status: string) => {
    await apiRequest(`/admin/appointment-status/${appointmentId}`, {
      method: 'PATCH',
      token,
      body: { status },
    });
    fetchAppointments();
  };

  const statusColor = (s: string) =>
    s === 'Scheduled' ? 'primary' : s === 'Completed' ? 'success' : 'error';

  const today = new Date().toLocaleDateString();
  const todaysAppointments = appointments.filter(a => new Date(a.appointmentDate).toLocaleDateString() === today);
  const pendingAppointments = appointments.filter(a => a.status === 'Scheduled');
  const uniquePatients = Array.from(new Set(appointments.map(a => a.patientId)))
    .map(id => appointments.find(a => a.patientId === id)?.Patient)
    .filter(Boolean);

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" className="text-gradient" sx={{ mb: 1 }}>
        Doctor Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Welcome, Dr. {user?.firstName}. Manage your patient appointments below.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        {['Scheduled', 'Completed', 'Cancelled'].map(s => (
          <Box key={s} className="glass-panel" sx={{ p: 2.5, textAlign: 'center', minWidth: 120 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {appointments.filter(a => a.status === s).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">{s}</Typography>
          </Box>
        ))}
      </Box>

      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Main Content: Pending Actions & All Appointments */}
          <Box sx={{ flex: '1 1 500px' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PendingActions color="primary" /> Pending Actions
              </Typography>
              {pendingAppointments.length === 0 ? (
                <Typography color="text.secondary">No pending appointments require action.</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Patient</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Date & Time</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAppointments.slice(0, 5).map(a => (
                        <TableRow key={a.id}>
                          <TableCell sx={{ color: 'white' }}>{a.Patient?.Profile?.firstName} {a.Patient?.Profile?.lastName}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{new Date(a.appointmentDate).toLocaleString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="outlined" color="success" onClick={() => updateStatus(a.id, 'Completed')}>Complete</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => updateStatus(a.id, 'Cancelled')}>Cancel</Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>All Appointments</Typography>
            <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Patient', 'Date & Time', 'Status'].map(h => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>No appointments yet.</TableCell></TableRow>
                  ) : appointments.map(a => (
                    <TableRow key={a.id}>
                      <TableCell sx={{ color: 'white' }}>
                        {a.Patient?.Profile?.firstName} {a.Patient?.Profile?.lastName}
                        <br /><Typography variant="caption" color="text.secondary">{a.Patient?.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{new Date(a.appointmentDate).toLocaleString()}</TableCell>
                      <TableCell><Chip label={a.status} color={statusColor(a.status) as any} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Sidebar: Today's Schedule & Recent Patients */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Box className="glass-panel" sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Event color="primary" /> Today's Schedule
              </Typography>
              {todaysAppointments.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No appointments scheduled for today.</Typography>
              ) : (
                <List disablePadding>
                  {todaysAppointments.map((a, i) => (
                    <Box key={a.id}>
                      <ListItem disableGutters>
                        <ListItemText 
                          primary={<Typography sx={{ color: 'white', fontWeight: 500 }}>{a.Patient?.Profile?.firstName} {a.Patient?.Profile?.lastName}</Typography>}
                          secondary={<Typography color="text.secondary" variant="body2">{new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>}
                        />
                        <Chip label={a.status} color={statusColor(a.status) as any} size="small" />
                      </ListItem>
                      {i < todaysAppointments.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
                    </Box>
                  ))}
                </List>
              )}
            </Box>

            <Box className="glass-panel" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonOutlined color="primary" /> Recent Patients
              </Typography>
              <List disablePadding>
                {uniquePatients.slice(0, 4).map((p: any, i) => (
                  <Box key={p.id}>
                    <ListItem disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(0,112,243,0.2)', color: '#0070f3' }}>
                          {p.Profile?.firstName?.[0]}{p.Profile?.lastName?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>{p.Profile?.firstName} {p.Profile?.lastName}</Typography>}
                        secondary={<Typography color="text.secondary" variant="body2">{p.email}</Typography>}
                      />
                    </ListItem>
                    {i < Math.min(uniquePatients.length, 4) - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
                  </Box>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DoctorDashboard;
