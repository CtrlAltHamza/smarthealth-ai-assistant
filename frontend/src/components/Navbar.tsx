import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Remove early return, we want to show Navbar on landing page

  // Build nav items based on role
  const navItems: { label: string; path: string }[] = [];
  if (user?.role === 'Patient') {
    navItems.push({ label: 'Dashboard', path: '/dashboard' });
    navItems.push({ label: 'Symptom Checker', path: '/symptoms' });
    navItems.push({ label: 'Appointments', path: '/appointments' });
  } else if (user?.role === 'Doctor') {
    navItems.push({ label: 'My Schedule', path: '/doctor' });
  } else if (user?.role === 'Admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin' });
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 700 }}
          className="text-gradient"
          onClick={() => navigate(navItems[0]?.path || '/dashboard')}
        >
          ❤️ SmartHealth
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#0070f3' : 'rgba(255,255,255,0.7)',
                    fontWeight: location.pathname === item.path ? 700 : 400,
                    borderBottom: location.pathname === item.path ? '2px solid #0070f3' : 'none',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mr: 1 }}>
                {user?.firstName} ({user?.role})
              </Typography>

              <Button onClick={handleLogout} variant="outlined" color="error" size="small" sx={{ ml: 1 }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} color="inherit">Login</Button>
              <Button onClick={() => navigate('/register')} variant="contained" color="primary" sx={{ ml: 2 }}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
