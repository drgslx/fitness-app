"use client";

import { useEffect, useState } from "react";
import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/[lang]/loading";
import { formatText } from "@/utils/formatText";

const DisciplineDetails = ({ params: { lang, catId } }) => {
  const [discipline, setDiscipline] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${catId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setDiscipline(data);
      } catch (error) {
        console.error("Error fetching Disciplines:", error);
      }
    };

    if (catId) {
      fetchCategory();
    }
  }, [catId]);

  

  if (!discipline) {
    return (
      <div className="flex text-black justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <PageBannerTitle
        title={discipline.name}
        homeText="Torna agli corsi"
        homeUrl={`/${lang}/disciplines`}
      />

      <div className="bg-black text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left side: Image on top and Description below (3/4 of the width) */}
          <div className="col-span-2 flex flex-col gap-8">
            <div className="w-full flex justify-center md:justify-start">
              <div className="relative w-full h-60 sm:h-72 md:h-96 lg:h-[26rem] xl:h-[32rem] overflow-hidden shadow-lg">
                <Image
                  width={600}
                  height={900}
                  src={discipline.image}
                  alt={discipline.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <ul className="px-2 mb-8 space-x-[20px] sm:space-x-[30px] md:space-x-[40px] lg:space-x-[45px]  rtl:space-x-reverse">
              <li
                onClick={() => handleTabClick(0)}
                className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
                  activeTab === 0
                    ? "text-[#1151f2] border-b border-[#1151f2]"
                    : "text-[#859D8B]"
                }`}
              >
                Overview
              </li>

              <li
                onClick={() => handleTabClick(1)}
                className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
                  activeTab === 1
                    ? "text-[#1151f2] border-b border-[#1151f2]"
                    : "text-[#859D8B]"
                }`}
              >
                Istruttori
              </li>
              </ul>
              {activeTab === 0 && (
                <div className="w-full px-2 md:max-h-[28rem] overflow-auto overflow-x-hidden flex flex-col justify-between">
                  <p className="text-base md:text-lg leading-relaxed">
                    {formatText(discipline.description)}
                  </p>
                </div>
              )}

              {activeTab === 1 && (
                <div className="sm:align-center sm:justify-center flex flex-col justify-between">
                <div className="grid md:grid-cols-3 gap-2">
                  {discipline.instructors.length >0? discipline.instructors.map((instructor) => (
                    <Link
                      href={`/${lang}/instructors/instructors-details/${instructor.id}`}
                      key={instructor.id}
                    >
                      <div className="flex hover:scale-105 duration-500 ease-in-out  max-h flex-col items-start mb-4">
                        <Image
                          src={instructor.image}
                          alt={instructor.name}
                          width={500}
                          height={500}
                          className="w-full md:min-h-[20rem]    object-cover"
                        />
                        <p className="text-lg px-2 hover:text-[#1151F2] duration-500 ease-in-out">
                          {instructor.name}
                        </p>
                      </div>
                    </Link>
                  )):<h1 className="text-2xl font-bold text-[#fff]">Al momento non ci sono istruttori per {discipline.name}</h1>}
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisciplineDetails;
