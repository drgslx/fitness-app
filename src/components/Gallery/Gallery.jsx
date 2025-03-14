"use client";

import { useState } from "react";
import classes from "./Gallery.module.css";
import Image from "next/image";

import hero1 from "/public/images/sala/crossfit.jpeg";
import hero2 from "/public/images/sala/MMA1.png";
import hero3 from "/public/images/sala/MMA2.png";
import hero4 from "/public/images/sala/pesistica1.jpeg";
import hero5 from "/public/images/sala/pesistica2.jpeg";
import hero7 from "/public/images/sala/pugilato.jpeg";
import hero8 from "/public/images/sala/relax.jpeg";
import hero9 from "/public/images/sala/ring.jpeg";

export default function Gallery({ gallery }) {
  const images = gallery.map((galleryItem) => ({
    image: galleryItem.image,
    alt: galleryItem.title,
    title: galleryItem.title,
  }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="100"
      data-aos-duration="500"
      data-aos-once="true"
      className="relative w-full bg-black z-4  overflow-hidden shadow-md"
    >
      <div className=" relative w-full h-[40vh] lg:h-[75vh]  overflow-hidden shadow-md">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <Image
              src={image.image}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
              {image.title}
            </div>
          </div>
        ))}
        <button
          onClick={handlePrevClick}
          className="z-20 absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-black px-2 py-1 rounded-r-md shadow-md"
        >
          Prev
        </button>
        <button
          onClick={handleNextClick}
          className="z-20 absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-black px-2 py-1 rounded-l-md shadow-md"
        >
          Next
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 md:w-36 md:h-36 mx-1 cursor-pointer  ${
              index === currentImageIndex
                ? "border-[#f13a11]"
                : "border-transparent"
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={image.image}
              alt={image.alt}
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
