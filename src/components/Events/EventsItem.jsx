import Image from "next/image";
import Link from "next/link";
import React from "react";

function EventsItem({ event, lang }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Extract day, date, and time
    const day = date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
    const datePart = date.toLocaleDateString("en-US"); // e.g., 8/7/2024
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g., 04:00 PM

    return `${day} ${datePart}  ${timePart}`;
  };
  return (
      <div
        className="group"
       
      >
        <div className="relative overflow-hidden mb-[25px]">
          <Link href={`/${lang}/events/event-details/${event.id}`}>
            <Image width={500} height={500} src={event.image} alt="event" />
          </Link>

          <div
            className="absolute top-0 left-[-100%] w-full h-full text-center flex items-center justify-center group-hover:left-0"
            style={{
              backgroundColor: "rgba(5, 31, 13, 0.31)",
            }}
          >
            <Link
              href={`/${lang}/events/event-details/${event.id}`}
              className="bg-#f13a11 text-white text-[16px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151F2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
            >
              Maggiori dettagli <i className="ri-arrow-right-up-line"></i>
            </Link>
          </div>
        </div>

        <h3 className="px-2 text-[20px] md:text-[22px] leading-[1.2] mb-[10px]">
          <Link
            href={`/${lang}/events/event-details/${event.id}`}
            className="transition duration-500 ease-in-out hover:text-[#1151F2]"
          >
            {event.name}
          </Link>
        </h3>

        <ul className="px-2 space-y-[6px]">
          <li className="text-[15px] flex items-center">
            <i className="ri-map-pin-fill text-[#1151F2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
            {event.address}
          </li>
          <li className="text-[15px] flex items-center">
            <i className="ri-calendar-line text-[#1151F2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
            {formatDateTime(event.time)}
          </li>
        </ul>
      </div>
  );
}

export default EventsItem;
