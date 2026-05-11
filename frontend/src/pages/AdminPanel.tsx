import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Alert, CircularProgress,
  LinearProgress, List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import { Delete, Memory, Storage, NetworkCheck, PersonAdd, LocalHospital } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

const AdminPanel = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await apiRequest<any[]>('/admin/users', { token });
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    await apiRequest(`/admin/users/${userId}`, { method: 'DELETE', token });
    setMsg('User deleted successfully.');
    fetchUsers();
  };

  const roleColor = (r: string) =>
    r === 'Admin' ? 'error' : r === 'Doctor' ? 'warning' : 'primary';

  const counts = {
    total: users.length,
    patients: users.filter(u => u.role === 'Patient').length,
    doctors: users.filter(u => u.role === 'Doctor').length,
    admins: users.filter(u => u.role === 'Admin').length,
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse 60% 40% at 0% 0%, rgba(121,40,202,0.12), transparent), radial-gradient(ellipse 50% 30% at 100% 10%, rgba(0,112,243,0.08), transparent)',
      }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Typography variant="h3" className="text-gradient" sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 800 }}>
          Admin command
        </Typography>
        <Typography sx={{ color: 'var(--text-muted)', mb: 4, maxWidth: 560 }}>
          User directory, operational signals, and quick platform health readouts.
        </Typography>
      </motion.div>

      {msg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMsg('')}>{msg}</Alert>}

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([k, v]) => (
          <Box key={k} className="glass-panel" sx={{ p: 2.5, textAlign: 'center', minWidth: 110 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{v}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k}</Typography>
          </Box>
        ))}
      </Box>

      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Main User Table */}
          <Box sx={{ flex: '1 1 500px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>User Directory</Typography>
            <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['ID', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.5)' }}>{u.id}</TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {u.Profile?.firstName} {u.Profile?.lastName}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{u.email}</TableCell>
                      <TableCell><Chip label={u.role} color={roleColor(u.role) as any} size="small" /></TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(u.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Sidebar: System Metrics & Activity */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Box className="glass-panel" sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>System Metrics</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Storage fontSize="small" /> Database Capacity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">42%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={42} sx={{ height: 6, borderRadius: 3 }} />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NetworkCheck fontSize="small" /> API Health
                  </Typography>
                  <Typography variant="body2" color="success.main">99.9% Uptime</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 6, borderRadius: 3 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Memory fontSize="small" /> AI Model Accuracy
                  </Typography>
                  <Typography variant="body2" color="primary.main">92.5%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92.5} color="primary" sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            </Box>

            <Box className="glass-panel" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              <List disablePadding>
                {users.slice(0, 3).map((u, i) => (
                  <Box key={u.id}>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {u.role === 'Doctor' ? <LocalHospital color="warning" /> : <PersonAdd color="primary" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ color: 'white' }}>New {u.role} joined</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{u.Profile?.firstName} {u.Profile?.lastName} registered</Typography>}
                      />
                    </ListItem>
                    {i < 2 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
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

export default AdminPanel;
