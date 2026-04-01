import NaviBar from '../components/NaviBar';
import ItemCard from '../components/ItemCard';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import CategorySlider from '../components/CategorySlider';

const HomePage = ({ onAddToCart, products }) => {
  const featured = products.slice(0, 3);

  // Group products by category
  const categories = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <NaviBar />
      <div className="container mx-auto p-4">
        <Carousel items={featured} />
        <main className="grow">
          <h1 className="text-3xl font-bold mb-4 text-center">Chào mừng bạn đến với Đi chợ hộ</h1>
          {Object.keys(categories).map((category) => (
            <CategorySlider
              key={category}
              category={category}
              items={categories[category]}
              onAddToCart={onAddToCart}
            />
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;