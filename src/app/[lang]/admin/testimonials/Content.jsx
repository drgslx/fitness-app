"use client";
import TestimonialRow from "@/components/Admin/TestimonialRow";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Content = ({ testimonials = [] }) => {
	const router = useRouter();
	const handleDelete = async (testId) => {
		try {
			const response = await axios.delete(
				`/api/admin/testimonials/${testId}`
			);
			toast.success(response.data.message);
			router.refresh();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	};
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Image
						</th>
						<th scope="col" className="px-6 py-3">
							Name
						</th>
						<th scope="col" className="px-6 py-3">
							Designation
						</th>
						<th scope="col" className="px-6 py-3">
							Text
						</th>

						<th scope="col" className="px-6 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{testimonials.length > 0 ? (
						testimonials.map((test) => (
							<TestimonialRow
								{...test}
								key={test.id}
								onDelete={() => handleDelete(test.id)}
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
