import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const [email, setEmail] = useState('headoftable93@gmail.com');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/email/send-verification', { email });
      if (response.data?.success) {
        setSuccess(`✅ Verification code sent to ${email}`);
        setTimeout(() => setStep('verify'), 1500);
      } else {
        setError(response.data?.message || 'Failed to send verification email');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to send verification email';
      setError(errorMsg);
      console.error('Send verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/email/verify-token', { email, token: code });
      if (response.data?.success) {
        setSuccess('✅ Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data?.message || 'Invalid verification code');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid verification code';
      setError(errorMsg);
      console.error('Verify token error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-secondary)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          <div className={`flex-1 text-center ${ step === 'email' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm mb-2 ${
              step === 'email'
                ? 'bg-indigo-600 text-white'
                : 'bg-green-500 text-white'
            }`}>
              {step === 'email' ? '1' : '✓'}
            </div>
            <p className="text-sm font-semibold text-gray-700">Email</p>
          </div>
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className={`h-1 w-full ${
              step === 'verify' ? 'bg-indigo-600' : 'bg-gray-300'
            }`} />
          </div>
          <div className={`flex-1 text-center ${ step === 'verify' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm mb-2 ${
              step === 'verify'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <p className="text-sm font-semibold text-gray-700">Verify</p>
          </div>
        </div>

        {/* Main Card */}
        <div style={{ background: 'var(--bg-card, #fff)', borderRadius: 16, boxShadow: '0 6px 20px rgba(13, 38, 59, 0.06)', padding: 28 }}>
          {/* Header */}
          <div className="text-center mb-8">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {step === 'email' ? 'Verify Your Email' : 'Enter Code'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {step === 'email'
                ? "We'll send a verification code to your email"
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="text-red-600 font-bold text-xl mr-3">⚠️</div>
                <div>
                  <p className="text-red-800 font-semibold text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex">
                <div className="text-green-600 font-bold text-xl mr-3">✓</div>
                <div>
                  <p className="text-green-800 font-semibold text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {step === 'email' ? (
            <form onSubmit={handleSendVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, outline: 'none' }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: 'var(--gradient-main)', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none', fontWeight: 700 }}
              >
                {loading ? '⏳ Sending Code...' : '📤 Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 20, textAlign: 'center', letterSpacing: 6 }}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Enter the 6-digit code from your email</p>
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                style={{ width: '100%', background: 'var(--gradient-main)', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none', fontWeight: 700 }}
              >
                {loading ? '⏳ Verifying...' : '✓ Verify Email'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                  setSuccess('');
                }}
                style={{ width: '100%', marginTop: 8, color: 'var(--accent-primary)', fontWeight: 700, background: 'transparent', border: 'none' }}
              >
                ← Back
              </button>
            </form>
          )}

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">💡 Tips:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Check your spam folder if you don't see the email</li>
              <li>• Code expires in 10 minutes</li>
              <li>• You have 3 attempts to enter the correct code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

    };

    export default VerifyEmailPage;
