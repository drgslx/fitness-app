import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PiBoxingGlove } from "react-icons/pi";

const DisciplineItem = ({ lang, discipline }) => {
  const getImage = (discipline) => {
    if (discipline.image) {
      return discipline.image;
    } else {
      return "/images/instructor.jpg";
    }
  };

  return (
    
    <div className="relative group rounded-lg shadow-lg overflow-hidden transition duration-500 hover:shadow-xl">
  {/* Discipline Name */}
  <div className="p-6">
    <h3 className="text-[22px] lg:text-[28px] font-semibold text-white mb-4 transition duration-500 ease-in-out hover:text-[#1151F2]">
      <Link href={`/${lang}/disciplines/discipline-details/${discipline.id}`}>
        {discipline.name}
      </Link>
    </h3>
  </div>

  {/* Image with Hover Effect */}
  <div className="relative ">
    <Link href={`/${lang}/disciplines/discipline-details/${discipline.id}`} className="block">
      <Image
        width={600}
        height={900}
        src={discipline.image}
        alt={discipline.name}
        className="w-full h-auto transform group-hover:scale-105  inset-0 bg-[#092C84] bg-opacity-0 group-hover:bg-opacity-60 transition duration-500 ease-in-out"
      />
    </Link>
  </div>

  {/* More Details Button */}
  <div className="p-6 text-center">
    <Link
      href={`/${lang}/disciplines/discipline-details/${discipline.id}`}
      className="inline-block text-[#f13a11] text-[14px] font-semibold py-[12px] sm:py-[14px] px-[25px] sm:px-[30px] border border-[#f13a11] rounded-full transition-all duration-500 hover:bg-[#1151F2] hover:border-[#1151F2] hover:text-white"
    >
      Maggiori dettagli
      <i className="ri-arrow-right-up-line ml-2"></i>
    </Link>
  </div>
</div>

  );
};

export default DisciplineItem;
