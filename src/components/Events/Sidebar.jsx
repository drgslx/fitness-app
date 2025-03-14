"use client";

import React from "react";
import GoogleMap from "./GoogleMap";

const Sidebar = ({ event }) => {
  const formatDateTimeDate = (dateString) => {
    const date = new Date(dateString);

    // Extract day, date, and time
    const day = date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
    const datePart = date.toLocaleDateString("en-US"); // e.g., 8/7/2024

    return ` ${datePart} ${day} `;
  };
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
      <div className="bg-white  p-2 sm:p-4 md:p-3 lg:p-4 xl:p-5 ">
        <div>
          <ul>
            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">Date:</p>
              <p className="text-[#000000]">
                {formatDateTimeDate(event.time)}{" "}
              </p>
            </li>

            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">Time:</p>
              <p className="text-[#000000]">
                {formatDateTimeHours(event.time)}{" "}
              </p>
            </li>

            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">Venue:</p>
              <p className="text-[#000000]">New york Education</p>
            </li>

            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">
                Organizer:
              </p>
              <p className="text-[#000000]">Wiliam Smith</p>
            </li>

            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">Phone:</p>
              <p className="text-[#000000]">{event.phone}</p>
            </li>

            <li className="flex items-center border-b border-[#000] pb-[12px] mb-[12px] last:border-none last:pb-[0] last:mb-[0]">
              <p className="font-semibold text-[#000000] w-[100px]">Address:</p>
              <p className="text-[#000000]">{event.address}</p>
            </li>
            
          </ul>
        </div>

         <GoogleMap address={event.address}/> 
      </div>
    </>
  );
};

export default Sidebar;
