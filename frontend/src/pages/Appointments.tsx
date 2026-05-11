import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Divider,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Star,
  RateReview,
  EventRepeat,
  CalendarMonth,
  LocalHospital,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiRequest } from '../api/client';

interface Doctor {
  id: number;
  email: string;
  avgRating?: number;
  reviewCount?: number;
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

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewDoctorId, setReviewDoctorId] = useState<number | null>(null);
  const [reviewApptId, setReviewApptId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [browseDoctorId, setBrowseDoctorId] = useState<number | null>(null);
  const [browseReviews, setBrowseReviews] = useState<any[]>([]);
  const [browseSummary, setBrowseSummary] = useState({ avgRating: 0, count: 0 });
  const [browseLoading, setBrowseLoading] = useState(false);

  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [rescheduleWhen, setRescheduleWhen] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const fetchDoctors = async () => {
    const data = await apiRequest<Doctor[]>('/appointments/doctors', { token });
    setDoctors(Array.isArray(data) ? data : []);
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await apiRequest<AppointmentRecord[]>(`/appointments/patient/${user.id}`, { token });
      setAppointments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [user?.id, token]);

  const openReviews = async (doctorId: number) => {
    setBrowseDoctorId(doctorId);
    setReviewOpen(false);
    setBrowseLoading(true);
    try {
      const res = await apiRequest<{ reviews: any[]; summary: { avgRating: number; count: number } }>(
        `/appointments/reviews/doctor/${doctorId}`
      );
      setBrowseReviews(res.reviews || []);
      setBrowseSummary(res.summary || { avgRating: 0, count: 0 });
    } catch {
      setBrowseReviews([]);
      setBrowseSummary({ avgRating: 0, count: 0 });
    } finally {
      setBrowseLoading(false);
    }
  };

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
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Booking failed.' });
    } finally {
      setBookLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await apiRequest<{ message: string }>(`/appointments/cancel/${appointmentId}`, { method: 'PATCH', token });
      setMessage({ type: 'success', text: 'Appointment cancelled.' });
      fetchAppointments();
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Cancel failed.' });
    }
  };

  const submitReview = async () => {
    if (!reviewDoctorId || !reviewRating) return;
    setReviewSubmitting(true);
    try {
      await apiRequest('/appointments/reviews', {
        method: 'POST',
        token,
        body: {
          doctorId: reviewDoctorId,
          appointmentId: reviewApptId,
          rating: reviewRating,
          comment: reviewComment,
        },
      });
      setMessage({ type: 'success', text: 'Thank you — your review was submitted.' });
      setReviewOpen(false);
      setReviewComment('');
      fetchDoctors();
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Could not submit review.' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const submitReschedule = async () => {
    if (!rescheduleId || !rescheduleWhen) return;
    setRescheduleLoading(true);
    try {
      await apiRequest(`/appointments/reschedule/${rescheduleId}`, {
        method: 'PATCH',
        token,
        body: { appointmentDate: rescheduleWhen },
      });
      setMessage({ type: 'success', text: 'Appointment rescheduled.' });
      setRescheduleId(null);
      setRescheduleWhen('');
      fetchAppointments();
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Reschedule failed.' });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'Scheduled') return 'primary';
    if (status === 'Completed') return 'success';
    return 'error';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        background:
          'radial-gradient(ellipse 70% 40% at 100% 0%, rgba(121,40,202,0.1), transparent), radial-gradient(ellipse 50% 30% at 0% 20%, rgba(0,112,243,0.08), transparent)',
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <LocalHospital sx={{ color: 'var(--primary)', fontSize: 36 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, fontFamily: 'Outfit', fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Appointments &amp; <span className="text-gradient">reviews</span>
            </Typography>
          </Box>
          <Typography sx={{ color: 'var(--text-muted)', mb: 4, maxWidth: 640, lineHeight: 1.7 }}>
            Book conflict-aware visits, read peer feedback for each doctor, rate completed encounters, and reschedule without leaving the app.
          </Typography>
        </motion.div>

        {message && (
          <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}>
          <Box className="glass-card" sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth color="primary" /> Book a visit
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 560 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--text-dim)' }}>Select doctor</InputLabel>
                <Select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  label="Select doctor"
                  sx={{ color: 'white', borderRadius: 2 }}
                >
                  {doctors.length === 0 ? (
                    <MenuItem disabled value="">
                      No doctors registered yet
                    </MenuItem>
                  ) : (
                    doctors.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                          <span>
                            Dr. {doc.Profile?.firstName} {doc.Profile?.lastName}
                          </span>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                            <Rating value={doc.avgRating || 0} readOnly precision={0.1} size="small" sx={{ color: 'var(--accent)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--text-dim)' }}>
                              ({doc.reviewCount ?? 0})
                            </Typography>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); openReviews(doc.id); }}>
                              Reviews
                            </Button>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Date & time"
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': { color: 'var(--text-dim)' },
                  '& .MuiOutlinedInput-input': { color: 'white', colorScheme: 'dark' },
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
                  '& .MuiInputLabel-root': { color: 'var(--text-dim)' },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                }}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleBook}
                disabled={bookLoading}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 2,
                  px: 4,
                  py: 1.25,
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  boxShadow: '0 8px 24px var(--primary-glow)',
                }}
              >
                {bookLoading ? <CircularProgress size={22} color="inherit" /> : 'Confirm booking'}
              </Button>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ borderColor: 'var(--glass-border)', mb: 4 }} />

        <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Outfit', fontWeight: 700 }}>
          Your timeline
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : appointments.length === 0 ? (
          <Box className="glass-panel" sx={{ p: 5, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--text-muted)' }}>No appointments yet. Book your first visit above.</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(0,112,243,0.08)' }}>
                  {['Doctor', 'When', 'Notes', 'Status', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Dr. {appt.Doctor?.Profile?.firstName} {appt.Doctor?.Profile?.lastName}
                      <Button size="small" sx={{ display: 'block', mt: 0.5 }} onClick={() => openReviews(appt.Doctor.id)}>
                        View reviews
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-muted)' }}>{new Date(appt.appointmentDate).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: 'var(--text-dim)' }}>{appt.notes || '—'}</TableCell>
                    <TableCell>
                      <Chip label={appt.status} color={statusColor(appt.status) as 'primary' | 'success' | 'error'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                        {appt.status === 'Scheduled' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EventRepeat />}
                              onClick={() => {
                                setRescheduleId(appt.id);
                                setRescheduleWhen(
                                  new Date(appt.appointmentDate).toISOString().slice(0, 16)
                                );
                              }}
                              sx={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            >
                              Reschedule
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(appt.id)}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {appt.status === 'Completed' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<RateReview />}
                            onClick={() => {
                              setReviewDoctorId(appt.Doctor.id);
                              setReviewApptId(appt.id);
                              setReviewOpen(true);
                            }}
                            sx={{ background: 'var(--accent)', color: '#0d1117' }}
                          >
                            Rate visit
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Reviews browser */}
        <Dialog
          open={browseDoctorId != null}
          onClose={() => setBrowseDoctorId(null)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: { sx: { background: 'var(--bg-soft)', border: '1px solid var(--glass-border)', borderRadius: 3 } },
          }}
        >
          <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
            Patient reviews
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 400, mt: 0.5 }}>
              {browseLoading ? 'Loading…' : (
                <>
                  <Star sx={{ fontSize: 16, verticalAlign: 'text-bottom', color: 'var(--accent)' }} />{' '}
                  {browseSummary.avgRating.toFixed(1)} average · {browseSummary.count} ratings
                </>
              )}
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: 'var(--glass-border)' }}>
            {browseReviews.length === 0 && !browseLoading ? (
              <Typography color="text.secondary">No reviews yet for this doctor.</Typography>
            ) : (
              browseReviews.map((r) => (
                <Box key={r.id} sx={{ mb: 2 }}>
                  <Rating value={r.rating} readOnly size="small" sx={{ color: 'var(--accent)' }} />
                  <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                    {r.Patient?.Profile?.firstName} {r.Patient?.Profile?.lastName?.[0]}.
                  </Typography>
                  {r.comment && (
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.5 }}>
                      {r.comment}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'var(--text-dim)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBrowseDoctorId(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Submit review */}
        <Dialog
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          slotProps={{
            paper: { sx: { background: 'var(--bg-soft)', border: '1px solid var(--glass-border)', borderRadius: 3 } },
          }}
        >
          <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>Rate your visit</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2, color: 'var(--text-muted)' }}>How was your experience with this doctor?</Typography>
            <Rating
              value={reviewRating}
              onChange={(_, v) => setReviewRating(v)}
              size="large"
              sx={{ color: 'var(--accent)', mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comments (optional)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              sx={{ '& .MuiInputLabel-root': { color: 'var(--text-dim)' }, '& .MuiOutlinedInput-input': { color: 'white' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button variant="contained" disabled={reviewSubmitting || !reviewRating} onClick={submitReview}>
              {reviewSubmitting ? <CircularProgress size={22} /> : 'Submit review'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reschedule */}
        <Dialog
          open={rescheduleId != null}
          onClose={() => setRescheduleId(null)}
          slotProps={{
            paper: { sx: { background: 'var(--bg-soft)', border: '1px solid var(--glass-border)', borderRadius: 3 } },
          }}
        >
          <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>Reschedule appointment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              type="datetime-local"
              label="New time"
              value={rescheduleWhen}
              onChange={(e) => setRescheduleWhen(e.target.value)}
              sx={{ mt: 2, '& .MuiOutlinedInput-input': { color: 'white', colorScheme: 'dark' } }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRescheduleId(null)}>Cancel</Button>
            <Button variant="contained" disabled={rescheduleLoading} onClick={submitReschedule}>
              {rescheduleLoading ? <CircularProgress size={22} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Appointments;
