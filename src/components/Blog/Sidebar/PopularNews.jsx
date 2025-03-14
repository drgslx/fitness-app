"use client";

import React from "react";
import Link from "next/link";

const PopularNews = () => {
	return (
		<>
			<div>
				<h3 className="text-[#000000] font-bold text-[22px] leading-none mb-[15px]">
					Popular News
				</h3>

				<div className="space-y-[15px]">
					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/blog-large-img1.jpg)`,
							}}
						></div>
						<div>
							<h3 className=" text-[#000000] leading-[1.2]  text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px] mb-[5px]">
								<Link
									href="/blog/blog-details"
									className="hover:text-[#F13A11]"
								>
									How can you started your business for small
									site
								</Link>
							</h3>
							<p className="text-[14px] text-[#000000] flex items-center">
								<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
								23 December 2023
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/blog-large-img2.jpg)`,
							}}
						></div>
						<div>
							<h3 className="text-[#000000] leading-[1.2]  text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px] mb-[5px]">
								<Link
									href="/blog/blog-details"
									className="hover:text-[#F13A11]"
								>
									Health Education: We provide you with the
									knowledge
								</Link>
							</h3>
							<p className="text-[14px] flex items-center">
								<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
								24 December 2023
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<div
							className="shrink-0 bg-cover bg-center h-[90px] w-[90px]"
							style={{
								backgroundImage: `url(/images/blog-large-img3.jpg)`,
							}}
						></div>
						<div>
							<h3 className="text-[#000000] leading-[1.2]  text-[16px] md:text-[18px] lg:text-[16px] xl:text-[18px] mb-[5px]">
								<Link
									href="/blog/blog-details"
									className="hover:text-[#F13A11]"
								>
									Health Assessments We begin by conducting
								</Link>
							</h3>
							<p className="text-[14px] flex items-center">
								<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
								25 December 2023
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PopularNews;
