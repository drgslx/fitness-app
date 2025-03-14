"use client";

import React, { useState } from "react";
import OverviewContent from "./OverviewContent";
import CurriculumContent from "./CurriculumContent";
import InstructorContent from "./InstructorContent";
import ReviewsContent from "./ReviewsContent";
import Image from "next/image";
import Sidebar from "./Sidebar/Sidebar";

const CourseDetailsContent = ({ course, currentUser }) => {
	const [activeTab, setActiveTab] = useState(0);
	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<div className="space-y-[30px]">
								<div className="relative">
									<Image
										src={course.image}
										width={900}
										height={790}
										alt="course"
									/>

									
								</div>

								{/* Tab */}
								<div>
									{/* Tab menu */}
									<ul className="space-y-[10px] space-x-[20px] sm:space-x-[30px] md:space-x-[40px] lg:space-x-[45px] xl:space-x-[50px] 2xl:space-x-[65px] rtl:space-x-reverse">
										<li
											onClick={() => handleTabClick(0)}
											className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
												activeTab === 0
													? "text-[#1151f2] border-b border-[#1151f2]"
													: "text-[#859D8B]"
											}`}
										>
											Overview
										</li>

										<li
											onClick={() => handleTabClick(1)}
											className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
												activeTab === 1
													? "text-[#1151f2] border-b border-[#1151f2]"
													: "text-[#859D8B]"
											}`}
										>
											Curriculum
										</li>
										{/* <li
											onClick={() => handleTabClick(2)}
											className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
												activeTab === 2
													? "text-[#1151f2] border-b border-[#1151f2]"
													: "text-[#859D8B]"
											}`}
										>
											Instructor
										</li> */}

									{/* 	<li
											onClick={() => handleTabClick(3)}
											className={`inline-block cursor-pointer font-bold text-[18px] md:text-[22px] hover:text-[#1151f2] ${
												activeTab === 3
													? "text-[#1151f2] border-b border-[#1151f2]"
													: "text-[#859D8B]"
											}`}
										>
											Reviews
										</li> */}
									</ul>

									{/* Tab content */}
									<div>
										{activeTab === 0 && (
											<OverviewContent {...course} />
										)}
										{activeTab === 1 && (
											<CurriculumContent {...course} />
										)}
										{activeTab === 2 && (
											<InstructorContent {...course} />
										)}
										{activeTab === 3 && (
											<ReviewsContent
												{...course}
												currentUser={currentUser}
											/>
										)}
									</div>
								</div>
							</div>
						</div>

						{/*  */}
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseDetailsContent;
