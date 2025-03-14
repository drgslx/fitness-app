"use client";

import React from "react";
import { useParams } from "next/navigation";

// Images

import DisciplineItem from "./DisciplineItem";


const DisciplinesList = ({ disciplines }) => {
  const { lang } = useParams();

  return (
      <div className="lg:py-[20px]">
          <div className="container mx-auto">
              <div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
              >
                  {disciplines.map((discipline) => (
                      <DisciplineItem key={discipline.id} lang={lang} discipline={discipline} />
                  ))}
              </div>
          </div>
      </div>
  );
};

export default DisciplinesList