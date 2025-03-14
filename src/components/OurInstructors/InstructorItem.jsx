import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PiBoxingGlove } from "react-icons/pi";

const InstructorItem = ({ lang, instructor }) => {
  const getImage = (instructor) => {
    if (instructor.image) {
      return instructor.image;
    } else {
      return "/images/instructor.jpg";
    }
  };

  return (
    <div className="relative group">
      <div className="">
        <h3 className="px-2 text-[28px] text-[#c8c8c8] md:text-[30px] lg:text-[36px] mb-[2px]">
          <Link
            href={`/${lang}/instructors/instructors-details/${instructor.id}`}
            className="transition  duration-500 ease-in-out hover:text-[#1151F2]"
          >
            {instructor.name}
          </Link>
        </h3>
        <div className="flex flex-row">
          {instructor.categories.map((category) => (
            <li
              className="sm:pr-2 sm:text-[15px] flex items-center"
              key={category.id}
            >
                <Link 
                  href={`/${lang}/disciplines/discipline-details/${category.id}`}
                >
                                <div className="flex flex-row">

                  <PiBoxingGlove
                    size={24}
                    className="text-[#f13a11] mr-1 mb-1"
                  />{" "}
                  <p className="transition duration-500 ease-in-out hover:text-[#f13a11] text-[16px] sm:-[16px] md:-[18px] lg:-[24px] text-[#c8c8c8]">
                    {category.name}
                  </p>\
              </div>
                </Link>
            </li>
          ))}
        </div>
      </div>
      <div className="relative md:pt-[20px] md:pl-[20px] md:before:absolute md:before:left-0 md:before:top-0 before:bg-[#092C84] before:w-[80%] before:h-[90%] hover:before:bg-[#1151F2]">
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
    </div>
  );
};

export default InstructorItem;
