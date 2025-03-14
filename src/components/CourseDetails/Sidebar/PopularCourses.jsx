"use client";

import React from "react";
import Link from "next/link";

const PopularCourses = () => {
	return (
		<>
			<div>
				<h3 className="text-[#000000] font-bold text-[22px] leading-none mb-[15px]">
					Popular Courses
				</h3>

				<div className="space-y-[15px]">
					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/course-img1.jpg)`,
							}}
						></div>
						<div>
							<h3 className="leading-[1.2] text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px]">
								<Link
									href="/courses/course-details"
									className="hover:text-[#1151f2]"
								>
									Nutrition Plans: Our experienced
									nutritionists will
								</Link>
							</h3>
							<h3 className="text-[#1151f2] leading-none font-semibold text-[17px] md:text-[20px] lg:text-[17px] xl:text-[20px] mt-[10px]">
								$283.00
							</h3>
						</div>
					</div>

					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/course-img2.jpg)`,
							}}
						></div>
						<div>
							<h3 className="leading-[1.2] text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px]">
								<Link
									href="/courses/course-details"
									className="hover:text-[#1151f2]"
								>
									Health Education: We provide you with the
									knowledge
								</Link>
							</h3>
							<h3 className="text-[#1151f2] leading-none font-semibold text-[17px] md:text-[20px] lg:text-[17px] xl:text-[20px] mt-[10px]">
								$283.00
							</h3>
						</div>
					</div>

					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/course-img3.jpg)`,
							}}
						></div>
						<div>
							<h3 className="leading-[1.2] text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px]">
								<Link
									href="/courses/course-details"
									className="hover:text-[#1151f2]"
								>
									Health Assessments We begin by conducting
								</Link>
							</h3>
							<h3 className="text-[#1151f2] leading-none font-semibold text-[17px] md:text-[20px] lg:text-[17px] xl:text-[20px] mt-[10px]">
								$283.00
							</h3>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PopularCourses;
