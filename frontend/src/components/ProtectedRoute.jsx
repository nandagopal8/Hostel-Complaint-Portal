import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// Redirects unauthenticated users to /login
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Redirects non-admins to student dashboard
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/student/dashboard" replace />;
  return children;
};

// Redirects logged-in users away from auth pages
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullPage />;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
};
