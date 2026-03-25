import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const Cart = ({ cart, onRemoveFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NaviBar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Giỏ hàng</h1>
        {cart.length === 0 ? (
          <p className='text-center'>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>Đơn giá: ${item.price.toFixed(2)}</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Thành tiền: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Xóa hàng
                </button>
              </div>
            ))}
            <div className="text-right mt-4">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;