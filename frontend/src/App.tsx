import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";

// Pages (lazy-loaded)
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const AppointmentsPage = React.lazy(() => import("./pages/AppointmentsPage"));
const SymptomCheckerPage = React.lazy(() => import("./pages/SymptomCheckerPage"));
const DoctorsPage = React.lazy(() => import("./pages/DoctorsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const VerifyEmailPage = React.lazy(() => import("./pages/VerifyEmailPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const BookAppointmentPage = React.lazy(() => import("./pages/BookAppointmentPage"));

// Layout
import MainLayout from "./components/common/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Spinner = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--bg-primary)" }}>
    <div style={{ width:40, height:40, border:"3px solid var(--border)", borderTopColor:"var(--accent-primary)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/book-appointment" element={<BookAppointmentPage />} />
                <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
}
