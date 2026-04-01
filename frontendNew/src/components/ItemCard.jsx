import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();

  const openProduct = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div
      onClick={openProduct}
      className="bg-white shadow-md rounded-lg p-4 m-2 w-64 cursor-pointer hover:shadow-lg transition"
    >
      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
      <button
        onClick={(event) => {
          event.stopPropagation();
          onAddToCart(item);
        }}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ItemCard;