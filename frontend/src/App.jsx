import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyComplaints from './pages/student/MyComplaints';
import CreateComplaint from './pages/student/CreateComplaint';
import ComplaintDetail from './pages/student/ComplaintDetail';
import StudentProfile from './pages/student/StudentProfile';
import Notifications from './pages/student/Notifications';
import StudentSettings from './pages/student/StudentSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';
import StudentManagement from './pages/admin/StudentManagement';
import Reports from './pages/admin/Reports';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* ─── Public Routes ────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* ─── Student Routes ───────────────────────── */}
          <Route path="/student">
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
            <Route path="complaints/new" element={<ProtectedRoute><CreateComplaint /></ProtectedRoute>} />
            <Route path="complaints/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><StudentSettings /></ProtectedRoute>} />
          </Route>

          {/* ─── Admin Routes ─────────────────────────── */}
          <Route path="/admin">
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="complaints" element={<AdminRoute><AdminComplaints /></AdminRoute>} />
            <Route path="complaints/:id" element={<AdminRoute><AdminComplaintDetail /></AdminRoute>} />
            <Route path="students" element={<AdminRoute><StudentManagement /></AdminRoute>} />
            <Route path="reports" element={<AdminRoute><Reports /></AdminRoute>} />
            <Route path="profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
            <Route path="settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          </Route>

          {/* ─── Fallback ─────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
