"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PiBoxingGlove } from "react-icons/pi";

const OurInstructors = ({ instructors, lang }) => {
  // Limit the array to the first 3 elements
  const limitedInstructors = instructors.slice(0, 3);

  const getImage = (instructor) => {
    if (instructor.image) {
      return instructor.image;
    } else {
      return "/images/instructor.jpg";
    }
  };

  return (
    <div>
        <div className="sm:py-[42px] md:py-[60px] lg:py-[80px] xl:py-[62px] 2xl:py-[46px] ">
        <h1 className="px-2 text-[30px] sm:text-[60px] md:text-[70px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[727px]">
          <Link className="transition duration-500 ease-in-out hover:text-[#1151f2]" href={`/${lang}/instructors`}>I nostri istruttori</Link>
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
          {limitedInstructors.map((instructor, index) => (
            <div
              className="mb-[25px] block h-45"
              key={instructor.id}
              data-aos="fade-up"
              data-aos-delay={`${100 + index * 100}`}
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div className="relative hover:scale-95 transition ease-in-out duration-500">
        <Link
          href={`/${lang}/instructors/instructors-details/${instructor.id}`}
          className="relative block w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden"
        >
          <Image
            width={400}
            height={600}
            src={getImage(instructor)}
            alt={instructor.id}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
              <h3 className="py-2 text-[20px] md:text-[22px] leading-[1.2]">
                <Link
                  href={`/${lang}/instructors/instructors-details/${instructor.id}`}
                  className="transition duration-500 ease-in-out hover:text-[#1151f2]"
                >
                  {instructor.name}
                </Link>
              </h3>

              <ul className=" flex items-center rtl:space-x-reverse">
                {instructor.categories.map((category) => (
                  <li
                    className="text-[13px] pr-1 sm:pr-1 sm:text-[15px] flex items-center"
                    key={category.id}
                  >
                    <PiBoxingGlove
                      size={24}
                      className="text-[#f13a11] "
                    />{" "}
                    <p className="text-[#c8c8c8]">{category.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link
          href="/instructors"
          className="text-[#f13a11] text-[14px] font-semibold flex justify-center items-center py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#f13a11] transition duration-500 ease-in-out hover:bg-[#1151F2] hover:border-[#1151F2] hover:text-[#fff]"
        >
          Controlla tutti gli istruttori{" "}
          <i className="ri-arrow-right-up-line"></i>
        </Link>
      </div>
    </div>
  );
};

export default OurInstructors;
