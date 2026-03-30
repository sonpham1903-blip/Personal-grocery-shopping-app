import NaviBar from "../NaviBar";
import Footer from "../Footer";
import Carousel from "../Carousel";
import CategorySlider from "../CategorySlider";
import { useProductStore } from "../../store/ProductStore";

type ProductItem = {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type HomePageProps = {
  onAddToCart: (item: ProductItem, quantity?: number) => void;
};

const HomePage = ({ onAddToCart }: HomePageProps) => {
  const { products, isLoading, error: apiError } = useProductStore();
  const featured = (products ?? []).slice(0, 3);

  // Group products by category
  const categories = (products ?? []).reduce<Record<string, ProductItem[]>>(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <NaviBar />
      <div className="container mx-auto p-4">
        <Carousel items={featured} />
        <main className="grow">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Chào mừng bạn đến với Đi chợ hộ
          </h1>
          {isLoading && (
            <p className="text-center text-blue-600">
              Đang tải sản phẩm từ API...
            </p>
          )}
          {apiError && <p className="text-center text-red-600">{apiError}</p>}
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
