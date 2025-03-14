"use client";
import React from "react";
import CourseRow from "@/components/Admin/CourseRow";

const CoursesTable = ({ courses }) => {
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
					</tr>
				</thead>
				<tbody>
					{courses.length > 0 ? (
						courses.map((course) => (
							<CourseRow key={course.id} {...course} />
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
