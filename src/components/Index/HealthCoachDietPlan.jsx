"use client";

import React from "react";
import Image from "next/image";

import hero from "/public/images/hero-4.png";
import icon1 from "/public/images/icon6.png";
import icon2 from "/public/images/icon7.png";
import icon3 from "/public/images/icon8.png";
import icon4 from "/public/images/icon9.png";

import shape2 from "/public/images/shape2.jpg";
import shape3 from "/public/images/shape3.jpg";
import shape4 from "/public/images/shape4.jpg";

const HealthCoachDietPlan = () => {
  return (
    <>
      <div className="bg-[#f13a11] relative py-[16px] md:py-[36px] lg:py-[42px] xl:py-[50px] 2xl:py-[84px]">
        <div className="container mx-auto">
          <div className="relative z-10 text-center">
            <Image
              src={hero}
              alt="hero"
              className="inline-block"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true"
            />


            <h1
              className="mt-[24px] text-[30px] sm:text-[60px] md:text-[70px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] mx-auto lg:max-w-[870px]"
             
            >
              Perché dovresti allenarti all&apos;Ultimate Arena?
            </h1>
          </div>

          <div className="grid p-4 gap-[30px] grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            <div
              
            >
              <Image src={icon1} alt="icon" className="mb-[20px]" />
              <h3 className="text-[20px] md:text-[22px] mb-[10px] leading-[1.3]">
                Vita quotidiana sana
              </h3>
              <ul>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Il movimento è la chiave per una vita sana
                </li>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Avere una routine per andare a letto
                </li>
              </ul>
            </div>

            <div
              
            >
              <Image src={icon2} alt="icon" className="mb-[20px]" />
              <h3 className="text-[20px] md:text-[22px] mb-[10px] leading-[1.3]">
                Fiducia
              </h3>
              <ul>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Modella la tua mente per raggiungere il successo nella
                  carriera, nelle relazioni e molto altro ancora
                </li>
              </ul>
            </div>

            <div
             
            >
              <Image src={icon3} alt="icon" className="mb-[20px]" />
              <h3 className="text-[20px] md:text-[22px] mb-[10px] leading-[1.3]">
                Auto difesa
              </h3>
              <ul>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Migliora le tue abilità di combattimento
                </li>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  mparerai a difenderti e a essere consapevole di ciò che ti
                  circonda
                </li>
              </ul>
            </div>

            <div
             
            >
              <Image src={icon4} alt="icon" className="mb-[20px]" />
              <h3 className="text-[20px] md:text-[22px] mb-[10px] leading-[1.3]">
                Forza mentale
              </h3>
              <ul>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Costruirai la resilienza
                </li>
                <li className="relative mt-[5px] pl-[20px] rtl:pl-0 rtl:pr-[20px] before:content-[''] before:bg-#f13a11 before:absolute before:w-[10px] before:h-[10px] before:rounded-full before:left-0 rtl:before:left-auto rtl:before:right-0 before:top-[7px]">
                  Sviluppa una mente forte
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shape Images */}
        <Image
          src={shape2}
          alt="shape2"
          className="absolute -top-[95px] left-[180px] hidden 2xl:block"
          data-aos="fade-in"
          data-aos-delay="100"
          data-aos-duration="500"
          data-aos-once="true"
        />
        <Image
          src={shape3}
          alt="shape3"
          className="absolute top-[60px] left-[100px] hidden 2xl:block"
          data-aos="fade-in"
          data-aos-delay="200"
          data-aos-duration="500"
          data-aos-once="true"
        />
        <Image
          src={shape3}
          alt="shape3"
          className="absolute top-[145px] right-[100px] hidden 2xl:block"
          data-aos="fade-in"
          data-aos-delay="200"
          data-aos-duration="500"
          data-aos-once="true"
        />
        <Image
          src={shape4}
          alt="shape4"
          className="absolute -top-[95px] right-[250px] hidden 2xl:block"
          data-aos="fade-in"
          data-aos-delay="300"
          data-aos-duration="500"
          data-aos-once="true"
        />
      </div>
    </>
  );
};

export default HealthCoachDietPlan;
