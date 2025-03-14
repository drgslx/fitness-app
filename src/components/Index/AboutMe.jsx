"use client";

import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import Image from "next/image";

import thumbImg from "/public/images/hero-2.png";
import playIcon from "/public/images/play-icon.png";

const AboutMe = () => {
  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);

  return (
    <>
      {/* Use here youtube Embed video link */}
      <FsLightbox
        toggler={toggler}
        sources={["https://www.youtube.com/watch?v=aYGEe-wnNH8"]}
      />

      <div className="bg-[#112FF5] w-full">
        <div className="relative w-full flex justify-center items-center">
          <Image className="w-full" src={thumbImg} alt="thumb" layout="responsive" />
          <div
            className="absolute flex justify-center items-center cursor-pointer"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            onClick={() => setToggler(!toggler)}
          >
            <Image
              src={playIcon}
              alt="playIcon"
              className="w-[140px] h-[140px] lg:w-[140px] lg:h-[140px]"
              layout="intrinsic"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutMe;
