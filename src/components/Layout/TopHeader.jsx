"use client";

import React from "react";
import GoToBottom from "./GoToBottom";
import Link from "next/link";
const TopHeader = () => {
  return (
    <>
      <div className="bg-black px-2 sm:px-2 lg:px-6 xl:px-12 2xl:px-20 py-[10px] overflow-hidden">
        <div className="container mx-auto max-w-[1570px]">
          <div className="grid items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
            
            <div className="text-center xl:text-left rtl:lg:text-right">
              <Link href="/schedule">
                <p className="hover:text-[#1151f2] text-[#f13a11 ] text-[12px] lg:text-[16px] transition duration-500 ease-in-out">
                  <span className="text-[#ffffff] font-semibold">
                    <i className="ri-time-line text-[#ffffff]"></i> Orario di
                    lavoro:
                  </span>{" "}
                  Si prega di controllare il
                  <span className="hover:text-[#1151f2]">orario</span>
                </p>
              </Link>
            </div>

            <div>
              <ul className="sm:flex items-center justify-center lg:justify-center text-center sm:text-left rtl:sm:text-right text-[#ffffff] text-[12px] lg:text-[16px] space-y-[5px] sm:space-x-[30px] rtl:space-x-reverse">
                <li className="relative sbefore:content-[''] sm:before:bg-black before:absolute before:right-[-16px] rtl:before:right-auto rtl:before:left-[-16px] before:top-[3px]before:h-[16px] lg:before:h-[20px] last:before:bg-transparent">
                  <a
                    href="mailto:ultimatearenato@gmail.com"
                    className="hover:text-[#f13a11] transition duration-500 ease-in-out"
                  >
                    ultimatearenato@gmail.com
                  </a>
                </li>

                <li className="relative before:content-[''] sm:before:bg-black before:absolute before:right-[-16px] rtl:before:right-auto rtl:before:left-[-16px] before:top-[3px] before:w-[1px] before:h-[16px] lg:before:h-[20px] last:before:bg-transparent">
                  <a
                    href="tel:+49298289828"
                    className=" transition duration-500 ease-in-out font-semibold hover:text-[#f13a11]"
                  >
                    +39 392 407 3942
                  </a>
                </li>

                <li className="text-[16px] lg:text-[24px] space-x-[10px] rtl:space-x-reverse relative before:content-[''] sm:before:bg-black before:absolute before:right-[-16px] rtl:before:right-auto rtl:before:left-[-16px] before:top-[3px] before:w-[1px] before:h-[16px] lg:before:h-[20px] last:before:bg-transparent">
                  <a
                    className="text-center  transition duration-500 ease-in-out hover:text-[#f13a11] hover:bg-black text-[#ffffff] py-[0px] px-[4px] rounded-full bg-[#1151f2]"
                    href="https://www.instagram.com/ultimatearena.fight/"
                    target="_blank"
                  >
                    <i className="ri-instagram-fill"></i>
                  </a>
                  <a
                    className="hover:text-[#f13a11] transition ease-in-out duration-500 hover:bg-black text-[#ffffff] py-[0px] px-[4px] rounded-full bg-[#1151f2]"
                    href="https://www.facebook.com/ultimatearena.fight/"
                    target="_blank"
                  >
                    <i className="ri-facebook-fill "></i>
                  </a>
                </li>
                <li className="text-[16px] lg:text-[18px] space-x-[10px] rtl:space-x-reverse relative before:content-[''] sm:before:bg-black before:absolute before:right-[-16px] rtl:before:right-auto rtl:before:left-[-16px] before:top-[3px] before:w-[1px] before:h-[16px] lg:before:h-[20px] last:before:bg-transparent">
                  <GoToBottom />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeader;
