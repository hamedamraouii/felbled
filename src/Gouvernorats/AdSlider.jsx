import React, { useState, useEffect } from 'react';
import './AdSlider.css';

const AdSlider = ({ orientation = "vertical" }) => {
  const publicites = [
    "/publicite/pub1.png"
   
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % publicites.length);
    }, 4000); // Change chaque 4s
    return () => clearInterval(interval);
  }, [publicites.length]);

  return (
    <div className="ad-slider-single">
      <img src={publicites[index]} alt={`pub${index + 1}`} />
    </div>
  );
};

export default AdSlider;
