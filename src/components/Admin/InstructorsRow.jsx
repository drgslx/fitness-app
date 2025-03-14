"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

const InstructorsRow = ({
  id,
  image,
  name,
  description,
  categories,
  onDelete,
  videoImage,
  videoUrl
}) => {
  const router = useRouter();

  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4 text-left">
        <Image
          width={100}
          height={100}
          src={image}
          alt={name} // Use name for accessibility
          className="w-40px rounded-circle"
        />
      </td>
      <td className="px-6 py-4 text-left">{name}</td>
      <td className="px-6 py-4 text-left">
        {categories && categories.length > 0
          ? categories.map((category) => category.name).join(", ") // Join categories if multiple
          : "N/A"}
      </td>
      <td className="px-6 py-4 text-left">{description}</td>
      <td className="px-6 py-4 text-left">
        <Image
          width={100}
          height={100}
          src={videoImage}
          alt={videoImage} // Use video image for accessibility
          className="w-40px rounded-circle"
        />
      </td>
      <td className=" text-start">{videoUrl}</td>
      
      <td className="flex px-6 py-4 space-x-1">
        <button
          onClick={() => onDelete(id)}
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          <i className="ri-delete-bin-line"></i>{" "}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/admin/instructors/${id}`)}
          className="bg-[#1151F2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          <i className="ri-edit-box-line"></i>{" "}
        </button>
      </td>
    </tr>
  );
};

export default InstructorsRow;
