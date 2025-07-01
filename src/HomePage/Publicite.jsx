// Publicite.jsx
import React from "react";
import Slider from "react-slick";
import "./publicite.css";

const Publicite = () => {
  const publicites = [
    { id: 1, image: "/publicite/pub1.png", alt: "service 1" },
    { id: 2, image: "/publicite/pub1.png", alt: "produit 1" },
    { id: 3, image: "/publicite/pub1.png", alt: "produit 1" },
    { id: 4, image: "/publicite/pub1.png", alt: "produit 1" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="publicite-slider-container">
      <Slider {...settings}>
        {publicites.map((pub) => (
          <div key={pub.id} className="publicite-slide">
            <img src={pub.image} alt={pub.alt} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Publicite;
