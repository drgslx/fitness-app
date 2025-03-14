"use client";

import Image from "next/image";
import React from "react";

const PartnerRow = ({ id, name, image, onDelete }) => {
	return (
		<tr className="bg-white border-b">
			<td className="px-6 py-4">{name}</td>
			<td className="px-6 py-4">
				<Image
					width={150}
					height={60}
					src={image}
					alt="image"
					className="w-100px"
				/>
			</td>
			<td className="px-6 py-4">
				<button
					onClick={() => onDelete(id)}
					type="button"
					className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
				>
					Delete{" "}
				</button>
			</td>
		</tr>
	);
};

export default PartnerRow;
