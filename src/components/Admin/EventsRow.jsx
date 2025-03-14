"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

const EventsRow = ({
	id,
	image,
	name,
    time,
	description,
    venue,
    organizer,
    phone,
    address,
	onDelete,
}) => {
	const router = useRouter();
	const formatDateTime = (dateString) => {
		const date = new Date(dateString);
	
		// Extract day, date, and time
		const day = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., Monday
		const datePart = date.toLocaleDateString('en-US'); // e.g., 8/7/2024
		const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // e.g., 04:00 PM
	
		return `${day} ${datePart}  ${timePart}`;
	};
	return (
		<tr className="bg-white border-b">
			<td className="px-2 py-4">
				<Image
					width={300}
					height={600}
					src={image}
					alt="image"
					className="w-40px rounded-circle"
				/>
			</td>
			<td className="px-2 py-4">{name}</td>
			<td className="px-2 py-4">{description}</td>
            <td className="px-2 py-4">{formatDateTime(time)}</td>

            <td className="px-2 py-4">{venue}</td>
            <td className="px-2 py-4">{organizer}</td>
            <td className="px-2 py-4">{phone}</td>
            <td className="px-2 py-4">{address}</td>
			<td className="flex px-2 py-4 space-x-1">
				<button
					onClick={() => onDelete(id)}
					type="button"
					className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
				>
					<i className="ri-delete-bin-line"></i>{" "}
				</button>

				<button
					type="button"
					onClick={() => router.push(`/admin/events/${id}`)}
					className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
				>
					<i className="ri-edit-box-line"></i>{" "}
				</button>
			</td>
		</tr>
	);
};

export default EventsRow;
