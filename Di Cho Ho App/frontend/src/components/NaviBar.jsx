import { Link } from 'react-router-dom';

const NaviBar = () => {
  return (
    <nav className="bg-blue-900 w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Đi Chợ Hộ</Link>
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/products" className="text-gray-100 hover:text-gray-200 px-3 py-2">Sản phẩm</Link>
          <Link to="/cart" className="text-gray-100 hover:text-gray-200 px-3 py-2">Giỏ hàng</Link>
          <Link to="/login" className="text-gray-100 hover:text-gray-200 px-3 py-2">Đăng nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default NaviBar;