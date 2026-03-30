import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from './contexts/AuthContext';

/**
 * ProtectedRoute: Ensures user is logged in AND has the required role.
 * If not logged in → redirect to the role's login page.
 * If wrong role → redirect to their own dashboard.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const location = useLocation();

  // Still restoring session from localStorage
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-base)', color: 'var(--color-text-3)',
        flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ fontSize: '48px', animation: 'spin 1.5s linear infinite' }}>⟳</div>
        <span>Đang tải...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    const loginPath = ROLE_CONFIG[requiredRole]?.loginPath ?? '/login/user';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but wrong role — send to their own dashboard
    return <Navigate to={user.redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
