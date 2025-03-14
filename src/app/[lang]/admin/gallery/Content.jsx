"use client";
import GalleryRow from "@/components/Admin/GalleryRow";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const Content = ({ gallery }) => {
	const router = useRouter();
	const handleDelete = async (galleryId) => {
		try {
			const response = await axios.delete(
				`/api/admin/gallery/${galleryId}`
			);
			toast.success(response.data.message);
			router.refresh();
		} catch (err) {
			// console.log(err.data);
			toast.error(err.data.response.message);
		}
	};
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Title
						</th>
						<th scope="col" colspan="2" className="px-6 py-3">
							Image
						</th>

					</tr>
				</thead>
				<tbody>
					{gallery.length > 0 ? (
						gallery.map((galleryItem) => (
							<GalleryRow
								key={galleryItem.id}
								{...galleryItem}
								onDelete={() => handleDelete(galleryItem.id)}
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
