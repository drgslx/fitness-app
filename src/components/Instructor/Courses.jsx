"use client";

import React from "react";
import Nav from "./Nav";
import CourseCard from "./CourseCard";

const Courses = ({ courses, currentUser }) => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1150px]">
					{/* Nav */}
					<Nav />

					<div className="grid gap-[30px] lg:gap-[40px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
						{courses.map((course, index) => (
							<CourseCard
								key={index}
								{...course}
								currentUser={currentUser}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Courses;
