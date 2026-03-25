import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    // Simple sign up logic, just alert for now
    alert(`Đăng ký thành công với ${email}`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NaviBar />
      <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2">
            Đăng ký
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
          >
            Quay lại Đăng nhập
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
