"use client";

import React from "react";
import Image from "next/image";

import instructor from "/public/images/instructor.jpg";

const InstructorContent = ({ user }) => {
	return (
		<>
			<div className="pt-[30px]">
				<div className="grid items-center gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					<Image
						src={user.image ? user.image : instructor}
						width={300}
						height={300}
						alt="instructor"
					/>

					<div className="lg:col-span-2">
						<div>
							<div className="border-b border-[#1151f2] pb-[15px] mb-[15px]">
								<h2 className="text-[#000000] font-bold text-[22px] md:text-[25px] lg:text-[22px] xl:text-[25px] 2xl:text-[30px] leading-none mb-[5px]">
									{user.name}
								</h2>
								<p className="text-[15px] xl:text-[16px]">
									{user.designation}
								</p>
							</div>

							<p className="text-[15px] xl:text-[16px]">
								Our online courses cover a wide range of topics,
								from personal development and wellness to
								professional skills like leadership,
								communication, and for the
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default InstructorContent;
