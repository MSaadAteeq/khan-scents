import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminGuard() {
  const { username, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted">
        Loading…
      </div>
    );
  }

  if (!username) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
