import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple login logic, just alert for now
    alert(`Logged in with ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NaviBar />
      <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2">
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Đăng ký
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;