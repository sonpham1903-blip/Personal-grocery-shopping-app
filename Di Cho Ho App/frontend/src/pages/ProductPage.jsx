import { useState } from 'react';
import { useParams } from 'react-router-dom';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const ProductPage = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const item = products.find((product) => product.id === Number(id));
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <NaviBar />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-center text-lg">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    onAddToCart(item, quantity);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NaviBar />
      <main className="flex-grow container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="md:flex gap-6">
            <div className="md:w-1/3">
              <img src={item.image} alt={item.name} className="w-full h-80 object-cover rounded" />
            </div>
            <div className="md:w-2/3 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <p className="text-green-600 font-bold text-2xl mt-4">${item.price.toFixed(2)}</p>
              <div className="mt-6 flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAdd}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
