import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, TextField, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, CircularProgress,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

interface Doctor {
  id: number;
  email: string;
  Profile: { firstName: string; lastName: string; contactNumber: string };
}

interface AppointmentRecord {
  id: number;
  appointmentDate: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  Doctor: { id: number; email: string; Profile: { firstName: string; lastName: string } };
}

const Appointments = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDoctors = async () => {
    const data = await apiRequest<Doctor[]>('/appointments/doctors', { token });
    setDoctors(data);
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await apiRequest<AppointmentRecord[]>(`/appointments/patient/${user.id}`, { token });
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [user]);

  const handleBook = async () => {
    if (!selectedDoctorId || !appointmentDate) {
      setMessage({ type: 'error', text: 'Please select a doctor and appointment date/time.' });
      return;
    }
    setBookLoading(true);
    setMessage(null);
    try {
      await apiRequest<{ message: string }>('/appointments/book', {
        method: 'POST',
        token,
        body: {
          patientId: user?.id,
          doctorId: Number(selectedDoctorId),
          appointmentDate,
          notes,
        },
      });
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setSelectedDoctorId('');
      setAppointmentDate('');
      setNotes('');
      fetchAppointments();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Network error: Cannot reach backend.' });
    } finally {
      setBookLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await apiRequest<{ message: string }>(`/appointments/cancel/${appointmentId}`, { method: 'PATCH', token });
      setMessage({ type: 'success', text: 'Appointment cancelled.' });
      fetchAppointments();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to cancel appointment.' });
    }
  };

  const statusColor = (status: string) => {
    if (status === 'Scheduled') return 'primary';
    if (status === 'Completed') return 'success';
    return 'error';
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h3" className="text-gradient" sx={{ mb: 1 }}>
        Appointments
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Book and manage your doctor appointments
      </Typography>

      {/* Booking Form */}
      <Box className="glass-panel" sx={{ p: 4, maxWidth: 700, mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>📅 Book a New Appointment</Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Select Doctor</InputLabel>
          <Select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            label="Select Doctor"
            sx={{ color: 'white' }}
          >
            {doctors.length === 0 ? (
              <MenuItem disabled value="">No doctors registered yet</MenuItem>
            ) : (
              doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  Dr. {doc.Profile?.firstName} {doc.Profile?.lastName} ({doc.email})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Appointment Date & Time"
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-input': { color: 'white', colorScheme: 'dark' }
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-input': { color: 'white' }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleBook}
          disabled={bookLoading}
          sx={{ px: 4, py: 1.5 }}
        >
          {bookLoading ? <CircularProgress size={20} color="inherit" /> : 'Book Appointment'}
        </Button>
      </Box>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Appointment History */}
      <Typography variant="h5" sx={{ mb: 2 }}>📋 My Appointments</Typography>

      {loading ? (
        <CircularProgress />
      ) : appointments.length === 0 ? (
        <Box className="glass-panel" sx={{ p: 4, textAlign: 'center', maxWidth: 700 }}>
          <Typography color="text.secondary">No appointments found. Book your first one above!</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 900, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Doctor</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Notes</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell sx={{ color: 'white' }}>
                    Dr. {appt.Doctor?.Profile?.firstName} {appt.Doctor?.Profile?.lastName}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{appt.notes || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={appt.status}
                      color={statusColor(appt.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appt.status === 'Scheduled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(appt.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Appointments;
