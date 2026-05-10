import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link as MuiLink, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setCredentials({ user: data.data.user, token: data.data.token }));
        navigate('/dashboard');
      } else {
        alert(data?.error?.message || data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed', error);
      alert('Network error: Cannot reach the backend server. Make sure the backend is running on port 5000.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box className="glass-panel animate-fade-in" sx={{ p: 5, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h4" className="text-gradient" sx={{ mb: 1 }}>
          Join SmartHealth
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Create an account to start managing your health
        </Typography>

        <form onSubmit={handleRegister}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
          </Box>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
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
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />

          <FormControl fullWidth margin="normal" variant="outlined" sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' } }
          }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="Doctor">Doctor</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2, py: 1.5, color: '#000' }}
          >
            Create Account
          </Button>

          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" color="primary">
              Sign In
            </MuiLink>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
