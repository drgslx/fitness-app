"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";

const HeroBanner = ({ currentUser}) => {
  const { lang } = useParams();
  return (
    <>
      <div className=" bg-black pt-[42px] px-2 sm:px-2 lg:px-6 ">
        <div className="container mx-auto ">
        
        
            <div className="grid items-center gap-[40px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 relative">
              
            <div className="text-center md:text-start">
                <h4
                  className="text-[#f13a11] text-[20px] md:text-[30px] lg:text-[35px] xl:text-[40px] 2xl:text-[46px] font-bold leading-none mb-[16px]"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="500"
                  data-aos-once="true"
                >
                  Ciao, benvenuto a
                </h4>
                
                <h1
                  className="text-white text-[35px] md:text-[50px] lg:text-[54px] xl:text-[70px] 2xl:text-[140px] font-bold leading-none "
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="500"
                  data-aos-once="true"
                >
                  Ultimate Arena Fighting
                </h1>

                <div
                  className="space-x-[5px] sm:space-x-[20px] md:space-x-[10px] lg:space-x-[20px] rtl:space-x-reverse"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="500"
                  data-aos-once="true"
                >
                  {!currentUser && (
                    <Link
                      href={`/${lang}/login`}
                      className="primaryBg text-white text-[12px] sm:text-[13px] lg:text-[14px] font-medium inline-block rounded-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none transition duration-500 ease-in-out hover:bg-[#f13a11]"
                    >
                      Classes
                    </Link>
                  )}

                  <Link
                    href={`/${lang}/schedule`}
                    className="text-white text-[12px] bg-[#f13a11] sm:text-[13px] lg:text-[18px] font-medium inline-block rounded-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#000000] hover:text-[#fff]"
                  >
                   Orari
                  </Link>
                </div>



              </div>

              {/* Hero Image */}

              <ImageSlideshow />
            </div>
          </div>
        </div>
    </>
  );
};

export default HeroBanner;
