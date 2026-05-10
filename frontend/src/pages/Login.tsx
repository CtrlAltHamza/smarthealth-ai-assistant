import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        alert(data?.error?.message || data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Network error: Cannot reach the backend server. Make sure the backend is running on port 5000.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box className="glass-panel animate-fade-in" sx={{ p: 5, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h4" className="text-gradient" sx={{ mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to access your health dashboard
        </Typography>

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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>

          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" color="secondary">
              Register here
            </MuiLink>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
