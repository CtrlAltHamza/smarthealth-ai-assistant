import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating: number;
  bio: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    email: string;
  };
}

const BookAppointmentPage: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState('video');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await api.get('/doctors');
      if (response.data?.success) {
        setDoctors(response.data.data || []);
      } else {
        setError('Failed to fetch doctors. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch doctors';
      setError(`Unable to load doctors: ${errorMessage}`);
      console.error('Doctor fetch error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor');
      return;
    }
    if (!scheduledAt) {
      setError('Please select appointment date and time');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the appointment');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Try the /appointments/book endpoint first (mock server). Fallback to /appointments if not available.
      let response = await api.post('/appointments/book', {
        doctorId: selectedDoctor.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        duration,
        type,
        reason,
      });

      if (!response.data?.success && (response.status === 404 || /not found/i.test(response.data?.message || ''))) {
        response = await api.post('/appointments', {
          doctorId: selectedDoctor.id,
          scheduledAt: new Date(scheduledAt).toISOString(),
          duration,
          type,
          reason,
        });
      }

      if (response.data?.success) {
        setSuccess('Appointment booked successfully! Redirecting...');
        setTimeout(() => navigate('/appointments'), 2000);
      } else {
        setError(response.data?.message || 'Failed to book appointment');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment';
      setError(`Booking failed: ${errorMessage}`);
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-secondary)', padding: 24 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📅 Book an Appointment</h1>
          <p className="text-gray-600">Select a doctor and schedule your consultation</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="text-red-500 text-2xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-800">Something went wrong</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={fetchDoctors}
                  className="mt-2 text-red-600 hover:text-red-800 font-semibold text-sm underline"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="text-green-500 text-2xl mr-3">✅</div>
              <div>
                <h3 className="font-semibold text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctors List */}
          <div className="lg:col-span-2">
            <div style={{ background: 'var(--bg-card, #fff)', borderRadius: 12, boxShadow: '0 6px 18px rgba(13,38,59,0.06)', padding: 20 }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍⚕️ Available Doctors</h2>
              
              {fetching ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading doctors...</p>
                  </div>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">😔 No doctors available at the moment</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      style={{
                        padding: 12,
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: selectedDoctor?.id === doctor.id ? 'var(--accent-primary)' : 'var(--border)',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: selectedDoctor?.id === doctor.id ? 'var(--accent-bg)' : 'transparent',
                        boxShadow: selectedDoctor?.id === doctor.id ? '0 6px 18px rgba(99,102,241,0.08)' : undefined,
                        transition: 'all 0.18s ease-in-out',
                      }}
                    >
                      <div className="flex items-start">
                        <div className="text-4xl mr-3">{doctor.user.avatar || '👨‍⚕️'}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{doctor.user.name}</h3>
                          <p className="text-indigo-600 font-semibold text-sm">{doctor.specialization}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <span>⭐ {doctor.rating?.toFixed(1) || 'N/A'} | 📚 {doctor.experience} yrs</span>
                          </div>
                          <p className="font-semibold text-gray-900 mt-1">₹{doctor.consultationFee}/session</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div style={{ background: 'var(--bg-card, #fff)', borderRadius: 12, boxShadow: '0 6px 18px rgba(13,38,59,0.06)', padding: 18, position: 'sticky', top: 16 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Book Appointment</h2>
              
              {selectedDoctor && (
                <div className="mb-4 p-3" style={{ background: 'var(--accent-bg)', borderRadius: 8, border: '1px solid var(--accent-border)' }}>
                  <p className="text-sm text-gray-600">Selected:</p>
                  <p className="font-semibold text-indigo-900">{selectedDoctor.user.name}</p>
                  <p className="text-sm text-indigo-700">{selectedDoctor.specialization}</p>
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📞 Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="video">🎥 Video Call</option>
                    <option value="in-person">🏥 In-Person</option>
                    <option value="phone">☎️ Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">💬 Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your symptoms..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedDoctor}
                  style={{ width: '100%', background: 'var(--gradient-main)', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none', fontWeight: 700 }}
                >
                  {loading ? '⏳ Booking...' : '✅ Book Appointment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
