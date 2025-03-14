"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

const CatRow = ({ id, name, image, description, onDelete }) => {
  const { lang } = useParams();
  const router = useRouter();
  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4">
        <Image src={image} alt={name} width={100} height={100} />
      </td>
      <td className="px-6 py-4">{description}</td>

      <td className="flex px-6 py-4 space-x-2">
        <button
          onClick={() => onDelete(id)}
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          <i className="ri-delete-bin-line"></i>{" "}
        </button>

        <button
          type="button"
          className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => router.push(`/admin/categories/${id}`)}
        >
          <i className="ri-edit-box-line"></i>{" "}
        </button>
      </td>
    </tr>
  );
};

export default CatRow;
