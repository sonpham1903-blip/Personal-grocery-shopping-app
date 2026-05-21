import React, { useEffect, useState } from "react";
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
import ktsRequest from "../../../ultis/ktsrequest";

const Home = () => {
  const [categories, setCategories] = useState([]);

  console.log("Home component render, categories:", categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Home: Bắt đầu fetch categories...");
        const res = await ktsRequest.get("/categories");
        console.log("Home: Response từ API /categories:", res);
        console.log("Home: Data nhận được:", res.data);
        setCategories(res.data);
      } catch (error) {
        console.error("Home: Lỗi khi lấy danh mục:", error);
        console.error("Home: Error details:", error.response?.data || error.message);
      }
    };
    fetchCategories();
  }, []);

  const categorySections = [
    {
      categoryName: categories[0]?.name || "Rau Xanh",
      picCover: raucuqua,
    },
    {
      categoryName: categories[1]?.name || "Đồ Uống",
      picCover: thitca,
    },
    {
      categoryName: categories[2]?.name || "Dược liệu",
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
