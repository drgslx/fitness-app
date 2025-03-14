"use client";

import { useEffect, useState } from "react";
import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Events/Sidebar";
import OurNextEvents from "@/components/Shared/OurNextEvents";
import Loading from "@/app/[lang]/loading";

const EventDetails = ({ params: { lang, eventId} }) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (!event) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <PageBannerTitle
        title={event.name}
        homeText="Torna agli eventi"
        homeUrl={`/${lang}/events`}
        
      />

      <div className="bg-black text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-start py-8 ">
          <div className="px-2 sm:px-3 md:px-2  w-full flex justify-center md:justify-end pr-0 md:pr-10">
            <div className="relative  overflow-hidden shadow-lg">
              <Image
                width={600}
                height={900}
                src={event.image}
                alt={event.name}
                objectFit="cover"
              />

              <p className="pt-4 text-[20px] text-[#fff]">{event.description}</p>
            </div>
          </div>

          <div className="w-full  mt-8 md:mt-0 text-center flex flex-col gap-8 justify-between md:text-left">
            <Sidebar event={event} />
            
          </div>

         
          
        </div>
      </div>
    </>
  );
};

export default EventDetails;
