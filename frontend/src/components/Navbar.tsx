import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import type { RootState } from '../store';
import { useState } from 'react';
import {
  Menu as MenuIcon,
  HealthAndSafety,
  Dashboard as DashboardIcon,
  Psychology,
  EventNote,
  Logout,
  LocalHospital,
  AdminPanelSettings,
  Close,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate('/login');
  };

  const navItems = user
    ? user.role === 'Doctor'
      ? [{ label: 'Doctor Hub', path: '/doctor', icon: <LocalHospital sx={{ fontSize: 22 }} /> }]
      : user.role === 'Admin'
        ? [{ label: 'Admin', path: '/admin', icon: <AdminPanelSettings sx={{ fontSize: 22 }} /> }]
        : [
            { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
            { label: 'Symptom AI', path: '/symptoms', icon: <Psychology sx={{ fontSize: 22 }} /> },
            { label: 'Appointments', path: '/appointments', icon: <EventNote sx={{ fontSize: 22 }} /> },
          ]
    : [];

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2, pb: 2, background: 'var(--bg-soft)', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
          Menu
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'var(--glass-border)' }} />
      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => go(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                background: 'rgba(0, 112, 243, 0.15)',
                borderLeft: '3px solid var(--primary)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(13, 17, 23, 0.82)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.2, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isMobile && user && (
                <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                onClick={() => navigate(user ? (user.role === 'Doctor' ? '/doctor' : user.role === 'Admin' ? '/admin' : '/dashboard') : '/')}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    p: 1,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px var(--primary-glow)',
                  }}
                >
                  <HealthAndSafety sx={{ color: 'white' }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'Outfit',
                    letterSpacing: '-0.02em',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Smart<span style={{ color: 'var(--primary)' }}>Health</span>
                </Typography>
              </Box>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, flex: 1, justifyContent: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      px: 2,
                      borderRadius: '12px',
                      color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-muted)',
                      background:
                        location.pathname === item.path ? 'rgba(0, 112, 243, 0.1)' : 'transparent',
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      transition: 'var(--transition-fast)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-vibrant)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {user.firstName
                        ? `${user.firstName} ${user.lastName || ''}`.trim()
                        : user.email.split('@')[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {user.role}
                    </Typography>
                  </Box>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'var(--primary)',
                        fontFamily: 'Outfit',
                        fontWeight: 700,
                        border: '2px solid var(--glass-border)',
                        width: 42,
                        height: 42,
                      }}
                    >
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                          background: 'var(--bg-soft)',
                          border: '1px solid var(--glass-border)',
                          backdropFilter: 'blur(12px)',
                          color: 'white',
                          minWidth: 200,
                          borderRadius: '14px',
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ gap: 1.5, py: 1.5 }}
                    >
                      <Logout fontSize="small" color="error" />
                      <Typography sx={{ fontWeight: 600 }}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{ color: 'var(--text-muted)', fontWeight: 600 }}
                  >
                    Sign In
                  </Button>
                  <button className="btn-premium" onClick={() => navigate('/register')} style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
                    Get Started
                  </button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { background: 'transparent' } } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
