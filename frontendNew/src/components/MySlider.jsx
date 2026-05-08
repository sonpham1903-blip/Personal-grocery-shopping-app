import React from "react";
import Carousel from "./Carousel";

const MySlider = () => {
  const slides = [
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/XXR8kzF/3.png",
    "https://i.ibb.co/yg7BSdM/4.png",
  ];
  return (
    <div className="max-w-screen">
      <Carousel>
        {slides.map((s) => {
          return <img src={s} alt="" key={s} />;
        })}
      </Carousel>
    </div>
  );
};

export default MySlider;
