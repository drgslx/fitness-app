"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

const AnnouncementRow = ({ id, homeAnnouncement, scheduleAnnouncement}) => {
  const { lang } = useParams();
  const router = useRouter();
  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4">{homeAnnouncement}</td>
      <td className="px-6 py-4">{scheduleAnnouncement}</td>

      <td className="flex px-6 py-4 space-x-2">

        <button
          type="button"
          className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => router.push(`/admin/announcements/${id}`)}
        >
          <i className="ri-edit-box-line"></i>{" "}
        </button>
      </td>
    </tr>
  );
};

export default AnnouncementRow;
