"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const OurNextEvents = ({ events, lang }) => {
  const sortedEvents = events.sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  // Get the latest event
  const latestEvent = sortedEvents.slice(0, 1);
  // Get the 2nd and 3rd latest events
  const nextTwoEvents = sortedEvents.slice(1, 3);

  const formatDateTimeDay = (dateString) => {
    const date = new Date(dateString);

    // Extract day, date, and time
    const day = date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
    const formattedDay = day.toString().padStart(2, "0");

    return ` ${day} `;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Extract day, date, and time
    const day = date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
    const datePart = date.toLocaleDateString("en-US"); // e.g., 8/7/2024
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g., 04:00 PM

    return ` ${datePart}  ${timePart}`;
  };

  const formatDateWithoutYearAndHour = (dateString) => {
    const date = new Date(dateString);

    // Extract month and day
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = date.getDate();

    // Format with leading zeros and dots
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");

    return `${formattedMonth}.${formattedDay}`;
  };

  // Example usage:
  const formattedDate = formatDateWithoutYearAndHour("2024-08-07T00:00:00Z");
  console.log(formattedDate); // Output: "08.07"

  const formatDateTimeHours = (dateString) => {
    const date = new Date(dateString);

    // Extract day, date, and time
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g., 04:00 PM

    return `${timePart}  `;
  };

  return (
    <>
      <div className=" sm:py-[50px] md:py-[60px] lg:py-[80px] xl:py-[100px] 2xl:py-[120px] 3xl:py-[140px]">
        <div className="container mx-auto">
          <Link href={`/${lang}/events`}>
            {" "}
            <h1 className="p-4 sm:px-8 md:px-8 hover:text-[#1151f2] hover:ease-in duration-300 font-bold text-[30px] sm:text-[60px] md:text-[70px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[727px]">
              Prossimi eventi
            </h1>
          </Link>

          <div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
            {latestEvent.map((event, index) => (
              <div
                key={event.id}
                
              >
                <div className="relative md:pl-[50px] mb-[25px]">
                  <Link href={`/${lang}/events/event-details/${event.id}`}>
                    <Image
                      width={600}
                      height={900}
                      src={event.image}
                      alt="event"
                    />
                  </Link>

                  <div className="bg-[#1151f2] absolute left-0 bottom-[40px] text-white text-center w-[100px] h-[100px] leading-none text-[14px]">
                    <span className="text-[36px] block font-semibold mb-1 mt-[20px]">
                      {formatDateWithoutYearAndHour(event.time)}
                    </span>{" "}
                    {formatDateTimeHours(event.time)}
                  </div>
                </div>

                <h3 className="px-4 sm:px-8 md:px-8 text-[20px] md:text-[23px] leading-[1.2] mb-[10px]">
                  <Link
                    href={`/${lang}/events/event-details/${event.id}`}
                    className="transition duration-500 ease-in-out hover:text-[#1151f2]"
                  >
                    {event.name}
                  </Link>
                </h3>

                <ul className="px-4 sm:px-8 md:px-8 text-[15px]">
                  <li className="text-[15px] flex items-center">
                    <i className="ri-map-pin-fill text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2 "></i>{" "}
                    {formatDateTime(event.time)}
                  </li>
                  <li className="text-[15px] flex items-center">
                    <i className="ri-map-pin-fill text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2 "></i>{" "}
                    {event.address}
                  </li>
                </ul>
              </div>
            ))}

            <div className="space-y-[25px]">
              {nextTwoEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid items-center gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
                 
                >
                  <div>
                    <Link href={`/${lang}/events/event-details/${event.id}`}>
                      <Image
                        width={600}
                        height={900}
                        src={event.image}
                        alt="event"
                      />
                    </Link>
                  </div>

                  <div>
                    <div className="px-4 sm:px-8 md:px-8 text-[15px]">

                    <h3 className="text-[20px] md:text-[22px] leading-[1.2] mb-[10px]">
                      <Link
                        href={`/${lang}/events/event-details/${event.id}`}
                        className="transition duration-500 ease-in-out hover:text-[#1151f2]"
                      >
                        {event.name}
                      </Link>
                    </h3>

                    <p>{event.description}</p>
</div>
                    <ul className="px-4 mb-2 sm:px-8 md:px-8 border-t border-[#1151f2] space-y-[5px] mt-[15px] pt-[15px]">
                      <li className="text-[15px] flex items-center">
                        <i className="ri-map-pin-fill text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
                        {event.address}
                      </li>
                      <li className="text-[15px] flex items-center">
                        <i className="ri-calendar-fill text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
                        {formatDateTime(event.time)}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurNextEvents;
