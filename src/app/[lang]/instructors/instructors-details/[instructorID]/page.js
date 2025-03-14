"use client";

import { useEffect, useState, useCallback } from "react";
import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Image from "next/image";
import Link from "next/link";
import { PiBoxingGlove } from "react-icons/pi";
import Loading from "@/app/[lang]/loading";
import { formatText } from "@/utils/formatText";
import FsLightbox from "fslightbox-react";
import playIcon from "/public/images/play-icon.png";

const InstructorDetails = ({ params: { lang, instructorID } }) => {
  const [instructor, setInstructor] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [toggler, setToggler] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const checkScreenSize = useCallback(() => {
    setIsLargeScreen(window.innerWidth >= 768); // Tailwind 'md' breakpoint is 768px
  }, []);

  // Add event listener on mount and remove on unmount
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [checkScreenSize]);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await fetch(`/api/instructors/${instructorID}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      }
    };

    if (instructorID) {
      fetchInstructor();
    }
  }, [instructorID]);

  if (!instructor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <FsLightbox toggler={toggler} sources={[instructor.videoUrl]} />
      <PageBannerTitle
        title={instructor.name}
        homeText="Torna agli istruttori"
        homeUrl={`/${lang}/instructors`}
      />

      <div className="bg-black  text-white h-auto ">
        <ul className="pb-3 container mx-auto grid grid-cols-2  md:grid-cols-8 gap-4 sm:space-x-[30px] md:space-x-[40px] lg:space-x-[45px]  rtl:space-x-reverse">
          <li
            onClick={() => handleTabClick(0)}
            className={`p-2 sm:p-4 md:p-6 inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
              activeTab === 0
                ? "text-[#1151f2] border-b border-[#1151f2]"
                : "text-[#859D8B]"
            }`}
          >
            Overview
          </li>

          <li
            onClick={() => handleTabClick(1)}
            className={`p-2 sm:p-4 md:p-6 inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
              activeTab === 1
                ? "text-[#1151f2] border-b border-[#1151f2]"
                : "text-[#859D8B]"
            }`}
          >
            Video
          </li>
        </ul>

        <div className=" container pb-12 mx-auto flex flex-col md:flex-row items-start  ">
          {activeTab === 0 && (
            <div className="w-full  md:min-h-[542px] md:max-h-[542px] md:pr-2  mx-auto text-left flex flex-col gap-2 ">
              <h2 className="px-2 sm:px-0 sm:pb-2 flex flex-row sm:py-4 md:py-6  text-2xl md:text-3xl lg:text-4xl  font-semibold ">
                Corsi:{" "}
                {instructor.categories.map((category) => (
                  <div  key={category.id}>
                    <Link
                      href={`/${lang}/disciplines/discipline-details/${category.id}`}
                    >
                      <li
                        className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]  inline-flex items-start gap-2  md:p-2"
                        key={category.id}
                      >
                        <PiBoxingGlove
                          size={24}
                          className="text-[#f13a11]  "
                        />
                        <p className="text-[#c8c8c8]  text-l md:tex-xl lg:text-2xl duration-500 ease-in-out  hover:text-[#f13a11]">
                        
                          {category.name}
                        </p>
                      </li>
                    </Link>
                  </div>
                ))}
              </h2>
              {!isLargeScreen && (
                <div className="relative shadow-lg">
                  <Image
                    width={500}
                    height={700}
                    src={instructor.image}
                    alt={instructor.name}
                    objectFit="cover"
                  />
                </div>
              )}
              <p className="p-2 sm:p-0 md:max-h-[431px] overflow-auto overflow-x-hidden  text-align-left text-base md:text-lg leading-relaxed">
                {formatText(instructor.description) || instructor.description}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="w-full overflow-hidden overflow-x-hidden text-center flex flex-col gap-8 justify-between md:text-left">
              <div className="container  mx-auto">
                <div 
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="flex md:min-h-[542px] md:max-h-[542px] flex-col sm:flex-col md:flex-col items-center"
                >
                  <div className="relative  mx-auto my-auto flex justify-center items-center">
                    <Image
                      src={instructor.videoImage}
                      width={1200}
                      height={600}
                      alt="thumb"
                    />
                    <div
                      className="cursor-pointer absolute top-1/2 -translate-y-2/4 right-1/2"
                      onClick={() => setToggler(!toggler)}
                    >
                      <Image
                        src={playIcon}
                        alt="playIcon"
                        className="w-[80px] sm:display-none h-[80px] sm:w-[140px] sm:h-[140px] md:w-[100px] md:h-[100px] lg:w-[140px] lg:h-[140px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full md:min-h-[542px] md:max-h-[542px]  md:w-1/3 flex justify-center md:justify-center ">
            {isLargeScreen && (
              <div className="relative w-60  md:w-96 overflow-hidden shadow-lg">
                <Image
                  width={500}
                  height={700}
                  src={instructor.image}
                  alt={instructor.name}
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDetails;
