import NaviBar from '../components/NaviBar';
import ItemCard from '../components/ItemCard';
import Footer from '../components/Footer';

const Products = ({ onAddToCart, products }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NaviBar />
      <main className="grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <div className="flex flex-wrap justify-center">
          {products.map((product) => (
            <ItemCard key={product.id} item={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;