"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import hero2 from "/public/images/hero-5.png";
import hero3 from "/public/images/hero-6.png";
import hero4 from "/public/images/hero-7.png";
import hero7 from "/public/images/hero-10.png";

const images = [
  { image: hero3, alt: "A boxing picture" },
  { image: hero2, alt: "A boxing picture" },
  { image: hero4, alt: "A boxing picture" },
  { image: hero7, alt: "A boxing picture" },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="z-0 relative w-auto sm:h-[500px] md:h-[700px] lg:h-[700] xl:h-[800] 2xl:h-[900] rounded-lg overflow-hidden shadow-md">
  {images.map((image, index) => (
    <Image
      key={index}
      src={image.image}
      className={`absolute inset-0  opacity-0 transition-transform duration-500 ease-in-out ${
        index === currentImageIndex
          ? 'opacity-100 transform scale-100 translate-x-0 rotate-0 z-10'
          : 'transform scale-110 translate-x-[-1rem] rotate-[-5deg]'
      }`}
      alt={image.alt}
    />
  ))}
</div>
  );
}
