import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────
// Mock User Database
// ─────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    username: 'root',
    password: '1234',
    role: 'shop',
    displayName: 'Quản Trị Viên',
    avatar: '👑',
    email: 'root@dichogho.vn',
    redirectTo: '/admin/shop',
  },
  {
    id: 2,
    username: 'shop',
    password: '1234',
    role: 'shop',
    displayName: 'Cửa Hàng Demo',
    avatar: '🏪',
    email: 'shop@dichogho.vn',
    redirectTo: '/admin/shop',
  },
  {
    id: 3,
    username: 'user',
    password: '1234',
    role: 'user',
    displayName: 'Khách Hàng Demo',
    avatar: '👤',
    email: 'user@dichogho.vn',
    redirectTo: '/admin/user',
  },
  {
    id: 4,
    username: 'partner',
    password: '1234',
    role: 'partner',
    displayName: 'Shipper Demo',
    avatar: '🚚',
    email: 'partner@dichogho.vn',
    redirectTo: '/admin/partner',
  },
];

// ─────────────────────────────────────────────
// Role Config (màu sắc và nhãn)
// ─────────────────────────────────────────────
export const ROLE_CONFIG = {
  shop: {
    label: 'Người Bán',
    color: '#1B4332',
    lightColor: '#D1FAE5',
    loginPath: '/login/shop',
    dashboardPath: '/admin/shop',
    icon: '🏪',
  },
  user: {
    label: 'Khách Hàng',
    color: '#1E3A8A',
    lightColor: '#DBEAFE',
    loginPath: '/login/user',
    dashboardPath: '/admin/user',
    icon: '👤',
  },
  partner: {
    label: 'Shipper',
    color: '#7C2D12',
    lightColor: '#FED7AA',
    loginPath: '/login/partner',
    dashboardPath: '/admin/partner',
    icon: '🚚',
  },
};

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

const SESSION_KEY = 'dichogho_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Attempt login. Returns { success, user, message }.
   * @param {string} username
   * @param {string} password
   * @param {string} [expectedRole] - optional, enforce role match
   */
  const login = useCallback((username, password, expectedRole = null) => {
    const found = MOCK_USERS.find(
      (u) =>
        u.username === username.trim() &&
        u.password === password &&
        (expectedRole === null || u.role === expectedRole)
    );

    if (!found) {
      return {
        success: false,
        message:
          expectedRole
            ? `Tài khoản không hợp lệ hoặc không có quyền ${ROLE_CONFIG[expectedRole]?.label}`
            : 'Tên đăng nhập hoặc mật khẩu không đúng',
      };
    }

    // Strip password before storing
    const sessionUser = {
      id: found.id,
      username: found.username,
      role: found.role,
      displayName: found.displayName,
      avatar: found.avatar,
      email: found.email,
      redirectTo: found.redirectTo,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(user);
  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
