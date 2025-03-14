"use client";

import CatRow from "@/components/Admin/CatRow";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import AnnouncementRow from "@/components/Admin/AnnouncementRow";

const Content = ({ announcements }) => {
	const router = useRouter();
	const handleDelete = async (announcement) => {
		try {
			const response = await axios.delete(
				`/api/admin/announcement/${announcement}`
			);
			toast.success(response.data.message);
			router.refresh();
		} catch (err) {
			let {
				response: {
					data: { message },
				},
			} = err;
			toast.error(message);
		}
	};
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Home Announcement
						</th>
						<th scope="col" className="px-6 py-3">
							Schedule Announcement
						</th>
						<th scope="col" className="px-6 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{announcements.length > 0 ? (
						announcements.map((announcement) => (
							<AnnouncementRow
								{...announcement}
								key={announcement.id}
								onDelete={() => handleDelete(announcement.id)}
							/>
						))
					) : (
						<tr className="bg-white border-b">
							<td colSpan="7" className="text-center py-3">
								Empty!
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Content;
