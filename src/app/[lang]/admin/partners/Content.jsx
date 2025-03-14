"use client";
import PartnerRow from "@/components/Admin/PartnerRow";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const Content = ({ partners }) => {
	const router = useRouter();
	const handleDelete = async (partnerId) => {
		try {
			const response = await axios.delete(
				`/api/admin/partners/${partnerId}`
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
							Name
						</th>
						<th scope="col" className="px-6 py-3">
							Image
						</th>
						<th scope="col" className="px-6 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{partners.length > 0 ? (
						partners.map((partner) => (
							<PartnerRow
								key={partner.id}
								{...partner}
								onDelete={() => handleDelete(partner.id)}
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
