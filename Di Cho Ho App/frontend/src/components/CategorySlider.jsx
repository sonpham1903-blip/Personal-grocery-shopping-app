import ItemCard from './ItemCard';

const CategorySlider = ({ category, items, onAddToCart }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
      <div
        className="flex gap-4 overflow-x-auto py-2 direction"
        style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
            <ItemCard item={item} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;