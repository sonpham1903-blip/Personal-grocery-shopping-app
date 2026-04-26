import {
  Navbar,
  Footer,
  Promotion,
  Category,
  ProductCat,
  HotProducts,
  Header,
  Lastest,
  Sidebar,
  MidBanner,
  News1,
} from "../../components";
import raucuqua from "../../assets/imgs/banner_prduct3.webp";
import thitca from "../../assets/imgs/banner_prduct2.webp";
import michaopho from "../../assets/imgs/banner_prduct1.webp";
const Home = () => {
  return (
    <div>
      <Promotion />
      <Header />
      <Navbar />
      <div className="max-w-screen-xl bg-gray-100 mx-auto p-3">
        {/* <Slider /> */}
        <MidBanner />
        <Sidebar />
        <Category />
        <HotProducts title="nổi bật" />
        <Lastest />
        <ProductCat catTitle="rau - củ - quả" picCover={raucuqua} />
        <ProductCat catTitle="thịt - cá" picCover={thitca} />
        <ProductCat catTitle="mì - cháo - phở" picCover={michaopho} />
      </div>
      <News1/>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
