import React, { useState } from 'react';
import { Box, TextField, Typography, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { HealthAndSafety, ArrowForward } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setCredentials({ user: data.data.user, token: data.data.token }));
        if (data.data.user.role === 'Doctor') navigate('/doctor');
        else if (data.data.user.role === 'Admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        setError(data?.error?.message || data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Network error: Cannot reach the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(0, 112, 243, 0.05) 0%, transparent 70%)'
    }}>
      <Box className="glass-card animate-fade-in" sx={{ p: { xs: 4, md: 6 }, width: '100%', maxWidth: 450, textAlign: 'center' }}>
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          width: 60, height: 60, borderRadius: '16px', mx: 'auto', mb: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px var(--primary-glow)'
        }}>
          <HealthAndSafety sx={{ color: 'white', fontSize: 32 }} />
        </Box>

        <Typography variant="h3" sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 800 }}>
          Welcome <span className="text-gradient">Back</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 4 }}>
          Sign in to your intelligent health portal
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.2)',
                '& fieldset': { borderColor: 'var(--glass-border)' },
                '&:hover fieldset': { borderColor: 'var(--primary)' },
              },
              '& .MuiInputLabel-root': { color: 'var(--text-dim)' },
              '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.2)',
                '& fieldset': { borderColor: 'var(--glass-border)' },
                '&:hover fieldset': { borderColor: 'var(--primary)' },
              },
              '& .MuiInputLabel-root': { color: 'var(--text-dim)' },
              '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />
          
          <button
            type="submit"
            className="btn-premium"
            disabled={loading}
            style={{ width: '100%', marginTop: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <><ArrowForward fontSize="small" /> Sign In</>}
          </button>

          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            New to SmartHealth?{' '}
            <MuiLink component={Link} to="/register" sx={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Create Account
            </MuiLink>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
