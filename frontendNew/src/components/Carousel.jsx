import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Carousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  const prev = () => setActiveIndex((prevState) => (prevState - 1 + items.length) % items.length);
  const next = () => setActiveIndex((prevState) => (prevState + 1) % items.length);

  const activeItem = items[activeIndex];

  const goToProductPage = () => {
    navigate(`/product/${activeItem.id}`);
  };

  return (
    <div className="relative mt-6 mb-8">
      <div className="rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer" onClick={goToProductPage}>
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{activeItem.name}</h2>
            <p className="text-gray-600 mb-4">{activeItem.description}</p>
            <p className="text-xl text-green-600 font-bold mb-4">${activeItem.price.toFixed(2)}</p>
          </div>
          <div className="h-64 md:h-80">
            <img src={activeItem.image} alt={activeItem.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700"
      >
        &lt;
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700"
      >
        &gt;
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((item, index) => (
          <span
            key={item.id}
            className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
