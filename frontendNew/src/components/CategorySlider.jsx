import { useState } from 'react';
import ItemCard from './ItemCard';

const CategorySlider = ({ category, items, onAddToCart }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 5; // Show 5 items at a time

  const maxStartIndex = Math.max(0, items.length - itemsPerView);

  const next = () => {
    setStartIndex((prev) => Math.min(prev + 3, maxStartIndex));
  };

  const prev = () => {
    setStartIndex((prev) => Math.max(prev - 3, 0));
  };

  const visibleItems = items.slice(startIndex, startIndex + itemsPerView);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
      <div className="relative">
        <div className="flex space-x-4">
          {visibleItems.map((item) => (
            <div key={item.id} className="shrink-0">
              <ItemCard item={item} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
        {startIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 shadow-lg"
          >
            ‹
          </button>
        )}
        {startIndex < maxStartIndex && (
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 shadow-lg"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySlider;