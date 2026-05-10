import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import SymptomChecker from './pages/SymptomChecker';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect to role-appropriate home
  const homeRoute = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'Doctor') return '/doctor';
    if (user?.role === 'Admin') return '/admin';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={homeRoute()} /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/symptoms" element={isAuthenticated ? <SymptomChecker /> : <Navigate to="/login" />} />
        <Route path="/appointments" element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />} />

        {/* Doctor routes */}
        <Route path="/doctor" element={isAuthenticated && user?.role === 'Doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />

        {/* Admin routes */}
        <Route path="/admin" element={isAuthenticated && user?.role === 'Admin' ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
