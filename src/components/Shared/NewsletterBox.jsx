"use client";

import React from "react";

const NewsletterBox = () => {
  return (
    <>
      <div className="relative before:absolute before:content-[''] before:bg-[#C84B2F] before:bottom-0 before:left-0 before:h-[50%] before:w-full">
        <div className="container mx-auto">
          <div
            className="relative bg-white p-[30px] md:p-[50px] lg:p-[60px] xl:p-[100px]"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="500"
            data-aos-once="true"
          >
            <div className="grid items-center gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h1 className="text-[#000000] text-[30px] md:text-[40px] lg:text-[50px] xl:text-[70px] 2xl:text-[80px] sm:tracking-[-1.2px] leading-none">
                  Ricevi i miei suggerimenti via email.
                </h1>
              </div>

              <div>
                <form className="space-y-[15px]">
                  <input
                    type="email"
                    placeholder="La tua email"
                    className="bg-transparent text-black border border-[#000000] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-black"
                  />

                  <button
                    type="submit"
                    className="bg-black font-semibold text-white block w-full py-[15px] px-[10px] transition duration-500 ease-in-out hover:bg-[#c84b2f] hover:text-#C84B2F"
                  >
                    Iscriviti ora <i className="ri-arrow-right-up-line"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsletterBox;
