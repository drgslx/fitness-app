"use client";

import React from "react";

const FunFacts = () => {
	return (
		<>
			<div
				className="container mx-auto relative -top-[150px] -mb-[150px] lg:-top-[100px] lg:-mb-[-100px] xl:-top-[150px] xl:-mb-[150px]"
				data-aos="fade-up"
				data-aos-delay="100"
				data-aos-duration="500"
				data-aos-once="true"
			>
				<div className="primaryBg p-[50px] md:p-[70px] xl:py-[100px] xl:px-[80px] 2xl:p-[100px]">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
						<div>
							<h2 className="text-[#f13a11] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
								97+
							</h2>
							<p className="text-[#f13a11]">We Award Wining</p>
						</div>

						<div>
							<h2 className="text-[#f13a11] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
								965+
							</h2>
							<p className="text-[#f13a11]">Total Courses</p>
						</div>

						<div>
							<h2 className="text-[#f13a11] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
								100%
							</h2>
							<p className="text-[#f13a11]">Our Satisfection Rate</p>
						</div>

						<div>
							<h2 className="text-[#f13a11] text-[50px] md:text-[55px] xl:text-[80px] leading-none">
								753k
							</h2>
							<p className="text-[#f13a11]">Total Student</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default FunFacts;
