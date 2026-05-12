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
  Post,
} from "../../components";
import raucuqua from "../../assets/imgs/banner_prduct3.webp";
import thitca from "../../assets/imgs/banner_prduct2.webp";
import michaopho from "../../assets/imgs/banner_prduct1.webp";
import { ktsConfig } from "../../../ultis/config";

const Home = () => {
  const categorySections = [
    {
      categoryName: ktsConfig.categories[0]?.name || "Rau Xanh",
      picCover: raucuqua,
    },
    {
      categoryName: ktsConfig.categories[1]?.name || "Đồ Uống",
      picCover: thitca,
    },
    {
      categoryName: ktsConfig.categories[2]?.name || "Dược liệu",
      picCover: michaopho,
    },
  ];

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
        {categorySections.map((section) => (
          <ProductCat
            key={section.categoryName}
            categoryName={section.categoryName}
            picCover={section.picCover}
          />
        ))}
      </div>
      <Post />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
