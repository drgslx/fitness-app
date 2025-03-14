"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

const TestimonialRow = ({
	id,
	image,
	name,
	designation,
	description,
	onDelete,
}) => {
	const router = useRouter();
	return (
		<tr className="bg-white border-b">
			<td className="px-6 py-4">
				<Image
					width={300}
					height={300}
					src={image}
					alt="image"
					className="w-40px rounded-circle"
				/>
			</td>
			<td className="px-6 py-4">{name}</td>
			<td className="px-6 py-4">{designation}</td>
			<td className="px-6 py-4">{description}</td>
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
					onClick={() => router.push(`/admin/testimonials/${id}`)}
					className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
				>
					<i className="ri-edit-box-line"></i>{" "}
				</button>
			</td>
		</tr>
	);
};

export default TestimonialRow;
