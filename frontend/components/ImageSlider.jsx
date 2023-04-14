import { useState } from "react";
import Image from "next/image";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ImageSlider = ({ imagesArray, selectedViewMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlide = (currentIndex) => {
    setCurrentIndex(currentIndex);
  };
  return (
    <div>
      <ImageGallery
        items={imagesArray}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="bottom"
        onSlide={handleSlide}
        renderItem={(item, idx) => (
          <div className="relative flex items-center justify-center mt-12 bg-black h-40 sm:h-96 lg:h-[28rem]">
            <p className="text-2xl text-slate-50">Loading...</p>
            <Image
              className="z-10 object-contain"
              fill
              src={item}
              alt={`${item.make} ${item.model_name} ${item.trim_name} ${item.year} `}
            />
          </div>
        )}
      />
      <div className="flex justify-center mt-4">
        {imagesArray.map((image, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-16 h-12 md:h-16 md:w-20 mx-1 ${
              idx === currentIndex ? "border-2 border-blue-500" : ""
            }`}
          >
            <img
              src={image}
              alt={image.thumbnailAlt}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
