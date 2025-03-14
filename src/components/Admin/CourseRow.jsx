"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CourseRow = ({
	id,
	title,
	slug,
	regular_price,
	category,
	user,
	videos,
	approved,
	onApprove = null,
	onDeny = null,
}) => {
	const { lang } = useParams();
	return (
		<tr className="bg-white border-b">
			<td className="px-6 py-4">
				<Link href={`/${lang}/course/${slug}`}>{title}</Link>
			</td>

			<td className="px-6 py-4">${regular_price}</td>

			<td className="px-6 py-4">{category.name}</td>

			<td className="px-6 py-4">{user.name}</td>

			<td className="px-6 py-4">{videos.length}</td>

			<td className="px-6 py-4">
				{approved ? (
					<button className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
						Approved{" "}
					</button>
				) : (
					<button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
						Pending{" "}
					</button>
				)}
			</td>

			{!approved && (
				<td className="px-6 py-4 space-x-1">
					<button
						className="bg-[#1151f2] hover:bg-[#092C84] text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
						onClick={() => onApprove(id)}
					>
						Approve Now{" "}
					</button>

					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
						onClick={() => onDeny(id)}
					>
						Delete{" "}
					</button>
				</td>
			)}
		</tr>
	);
};

export default CourseRow;
