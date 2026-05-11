import React, { useState } from 'react';
import { Box, TextField, Typography, Link as MuiLink, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { HealthAndSafety, PersonAdd } from '@mui/icons-material';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setCredentials({ user: data.data.user, token: data.data.token }));
        const role = data.data.user.role;
        if (role === 'Doctor') navigate('/doctor');
        else if (role === 'Admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        setError(data?.error?.message || data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration failed', error);
      setError('Network error: Cannot reach the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.05) 0%, transparent 70%)'
    }}>
      <Box className="glass-card animate-fade-in" sx={{ p: { xs: 4, md: 5 }, width: '100%', maxWidth: 500, textAlign: 'center' }}>
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
          width: 60, height: 60, borderRadius: '16px', mx: 'auto', mb: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(121, 40, 202, 0.3)'
        }}>
          <HealthAndSafety sx={{ color: 'white', fontSize: 32 }} />
        </Box>

        <Typography variant="h3" sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 800 }}>
          Join <span className="text-gradient">SmartHealth</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 4 }}>
          Start your journey towards intelligent health management
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>{error}</Alert>}

        <form onSubmit={handleRegister}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth label="First Name" variant="outlined" margin="normal"
              value={firstName} onChange={(e) => setFirstName(e.target.value)} required
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(0,0,0,0.2)', '& fieldset': { borderColor: 'var(--glass-border)' }, '&:hover fieldset': { borderColor: 'var(--primary)' } },
                '& .MuiInputLabel-root': { color: 'var(--text-dim)' }, '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              fullWidth label="Last Name" variant="outlined" margin="normal"
              value={lastName} onChange={(e) => setLastName(e.target.value)} required
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(0,0,0,0.2)', '& fieldset': { borderColor: 'var(--glass-border)' }, '&:hover fieldset': { borderColor: 'var(--primary)' } },
                '& .MuiInputLabel-root': { color: 'var(--text-dim)' }, '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
          </Box>
          <TextField
            fullWidth label="Email Address" variant="outlined" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)} required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(0,0,0,0.2)', '& fieldset': { borderColor: 'var(--glass-border)' }, '&:hover fieldset': { borderColor: 'var(--primary)' } },
              '& .MuiInputLabel-root': { color: 'var(--text-dim)' }, '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />
          <TextField
            fullWidth label="Password" type="password" variant="outlined" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)} required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(0,0,0,0.2)', '& fieldset': { borderColor: 'var(--glass-border)' }, '&:hover fieldset': { borderColor: 'var(--primary)' } },
              '& .MuiInputLabel-root': { color: 'var(--text-dim)' }, '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />

          <FormControl fullWidth margin="normal" variant="outlined" sx={{
            '& .MuiInputLabel-root': { color: 'var(--text-dim)' },
            '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(0,0,0,0.2)', color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } }
          }}>
            <InputLabel>Account Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as string)} label="Account Role">
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="Doctor">Doctor</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <button
            type="submit"
            className="btn-premium"
            disabled={loading}
            style={{ width: '100%', marginTop: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <><PersonAdd fontSize="small" /> Create Account</>}
          </button>

          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <MuiLink component={Link} to="/login" sx={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign In
            </MuiLink>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
