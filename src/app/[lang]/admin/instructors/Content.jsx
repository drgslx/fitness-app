"use client";
import InstructorsRow from "@/components/Admin/InstructorsRow";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Content = ({ instructors }) => {
	const router = useRouter();
	const handleDelete = async(instructorID) => {
		try {
			const response = await axios.delete(
				`/api/admin/instructors/${instructorID}`
			);
			toast.success(response.data.message);
			router.refresh();
		} catch (err) {
			toast.error(err.response.data.message);
		}
	};
	return (
		<div className="relative ">
			<table className=" text-sm text-left rtl:text-right text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr className="bg-white border-b">
						<th scope="col" className="px-11 py-3">
							Image
						</th>
						<th scope="col" className="py-3">
							Name
						</th>
						<th scope="col" className="px-3 py-3">
							Discipline
						</th>
						
						<th scope="col" className="px-32 py-3">
							Description
						</th>

						<th scope="col" className="px-3 py-3">
							Video Thumbnail Image
						</th>

						<th scope="col" className="px-0 py-3">
							Video link
						</th>
						<th scope="col" className="px-3 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{instructors.length > 0 ? (
						instructors.map((instructor) => (
							<InstructorsRow
							key={instructor.id}
							{...instructor}
								onDelete={() => handleDelete(instructor.id)}
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
