"use client";

import React from "react";
import CourseCard from "../Shared/CourseCard";
import Pagination from "./Pagination";

const CoursesList = ({ courses, totalPages, totalCourses, currentUser }) => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
						{courses.map((course, index) => (
							<CourseCard
								key={index}
								{...course}
								currentUser={currentUser}
							/>
						))}
					</div>

					{/* Pagination */}
					<Pagination totalPages={totalPages} />
				</div>
			</div>
		</>
	);
};

export default CoursesList;
