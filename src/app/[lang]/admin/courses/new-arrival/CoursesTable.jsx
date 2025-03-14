"use client";
import React from "react";
import CourseRow from "@/components/Admin/CourseRow";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CoursesTable = ({ courses }) => {
	const router = useRouter();
	const handleApprove = async (courseId) => {
		try {
			const data = { approved: true };
			const response = await axios.post(
				`/api/admin/${courseId}/requests`,
				data
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

	const handleDeny = async (courseId) => {
		try {
			const data = { approved: false };
			const response = await axios.post(
				`/api/admin/${courseId}/requests`,
				data
			);
			toast.error("Not approved");
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
							Title
						</th>
						<th scope="col" className="px-6 py-3">
							Price
						</th>
						<th scope="col" className="px-6 py-3">
							Category
						</th>
						<th scope="col" className="px-6 py-3">
							Instructor
						</th>
						<th scope="col" className="px-6 py-3">
							Videos
						</th>
						<th scope="col" className="px-6 py-3">
							Status
						</th>
						<th scope="col" className="px-6 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{courses.length > 0 ? (
						courses.map((course) => (
							<CourseRow
								key={course.id}
								{...course}
								onApprove={() => handleApprove(course.id)}
								onDeny={() => handleDeny(course.id)}
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

export default CoursesTable;
