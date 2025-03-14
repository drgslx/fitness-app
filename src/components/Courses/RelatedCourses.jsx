"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import courseImg1 from "/public/images/course-img1.jpg";
import courseImg2 from "/public/images/course-img2.jpg";
import courseImg3 from "/public/images/course-img3.jpg";

import user1 from "/public/images/user1.png";
import user2 from "/public/images/user2.png";
import user3 from "/public/images/user3.png";
import CourseCard from "../Shared/CourseCard";

const RelatedCourses = ({ related, currentUser }) => {
	return (
		<>
			<div className="pb-[50px] md:pb-[60px] lg:pb-[140px]">
				<div className="container mx-auto">
					<h2 className="text-[#000000] text-[25px] md:text-[30px] lg:text-[40px] xl:text-[42px] mb-[30px] leading-none">
						Related Courses
					</h2>

					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
						{related.map((course, index) => {
							return (
								<CourseCard
									key={index}
									{...course}
									currentUser={currentUser}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default RelatedCourses;
