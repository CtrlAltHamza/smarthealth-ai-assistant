import { useEffect, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Snackbar, Alert } from '@mui/material';
import type { RootState } from '../store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [snack, setSnack] = useState<{
    open: boolean;
    title?: string;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socket.emit('join_user', user.id);
    socket.on('notification', (data: { title?: string; message?: string; type?: string }) => {
      const t = data.type || '';
      const severity: 'success' | 'info' | 'warning' | 'error' =
        t.includes('cancel') ? 'warning' : t.includes('booked') ? 'success' : 'info';
      setSnack({
        open: true,
        title: data.title,
        message: data.message || 'You have a new update.',
        severity,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={6500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snack.title ? (
            <>
              <strong>{snack.title}</strong>
              <br />
            </>
          ) : null}
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
