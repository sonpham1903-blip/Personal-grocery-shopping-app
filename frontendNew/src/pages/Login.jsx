import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ktsRequest from '../../ultis/ktsrequest';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'shipper') return '/shipper/dashboard';
    if (role === 'shop') return '/shop/dashboard';
    if (role === 'user') return '/user/dashboard';
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = { username, password };

    try {
      // Prefer signin for admin/shop/shipper, fallback to login for user
      let res;
      try {
        res = await ktsRequest.post('/auth/signin', payload);
      } catch (signinErr) {
        if (signinErr.response && signinErr.response.status >= 400) {
          // try user login endpoint
          res = await ktsRequest.post('/auth/login', payload);
        } else {
          throw signinErr;
        }
      }

      const data = res.data;
      const role = data.role || 'user';
      const redirectUrl = redirectByRole(role);

      // save auth data locally
      localStorage.setItem('currentUser', JSON.stringify(data));
      localStorage.setItem('token', data.token || '');

      navigate(redirectUrl);
    } catch (apiError) {
      console.error(apiError);
      const msg = apiError?.response?.data || apiError.message || 'Login không thành công';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NaviBar />
      <main className="grow container mx-auto p-4 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
                <div className="mb-4">
            <label className="block text-gray-700">Tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {error && (
            <p className="mb-4 text-red-600" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;