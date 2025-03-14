"use client";

import React from "react";
import { useParams } from "next/navigation";
import EventsItem from "./EventsItem";

const EventsList = ({ events }) => {
  const { lang } = useParams();

  // Sort events by creation date in descending order
  const sortedEvents = events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <>
        <div className="sm:py-[50px] md:py-[60px] lg:py-[80px] xl:py-[100px] 2xl:py-[120px] 3xl:py-[140px]">
        <div data-aos="fade-up" data-aos-duration="500" data-aos-once="true" data-aos-anchor-placement="top-bottom" className="container mx-auto">
          <div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {sortedEvents.map((event, index) => (
              <EventsItem key={index} lang={lang} event={event} />
            ))}
          </div>
          {/* Pagination */}
          {/* 
          <nav aria-label="Page navigation example">
            <ul className="space-x-[5px] rtl:space-x-reverse text-center mt-[30px] md:mt-[45px]">
              <li className="inline-block">
                <a
                  href="#"
                  className="flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-#f13a11 hover:border-[#1151F2] hover:text-[#fff]"
                >
                  <i className="ri-arrow-left-line"></i>
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#"
                  className="flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-#f13a11 hover:border-[#1151F2] hover:text-[#fff]"
                >
                  1
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#"
                  className="flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-#f13a11 hover:border-[#1151F2] hover:text-[#fff]"
                >
                  2
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#"
                  className="flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-#f13a11 hover:border-[#1151F2] hover:text-[#fff]"
                >
                  3
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#"
                  className="flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-#f13a11 hover:border-[#1151F2] hover:text-[#fff]"
                >
                  <i className="ri-arrow-right-line"></i>
                </a>
              </li>
            </ul>
          </nav>
          */}
        </div>
      </div>
    </>
  );
};

export default EventsList;
