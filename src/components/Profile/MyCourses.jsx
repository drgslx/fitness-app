"use client";

import React from "react";
import Nav from "./Nav";
import CourseCard from "../Shared/CourseCard";

const MyCourses = ({ favourites, buy = false, currentUser }) => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1150px]">
					{/* Nav */}
					<Nav />

					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
						{favourites.length > 0 &&
							favourites.map((favourite, index) => {
								const { course } = favourite;
								return (
									<CourseCard
										key={index}
										{...course}
										currentUser={currentUser}
										buy={buy}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</>
	);
};

export default MyCourses;
