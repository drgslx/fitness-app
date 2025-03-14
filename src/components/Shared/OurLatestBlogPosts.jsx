"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import blogImg1 from "/public/images/blog-img1.jpg";
import blogImg2 from "/public/images/blog-img2.jpg";
import blogImg3 from "/public/images/blog-img3.jpg";

const OurLatestBlogPosts = () => {
	return (
		<>
			<div>
				<div className="container mx-auto">
					<h1 className="text-[30px] sm:text-[60px] md:text-[70px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[727px]">
						Our latest blog posts
					</h1>

					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3">
						<div
							data-aos="fade-up"
							data-aos-delay="100"
							data-aos-duration="500"
							data-aos-once="true"
						>
							<Link
								href="/blog/blog-details"
								className="mb-[25px] block"
							>
								<Image src={blogImg1} alt="blog" />
							</Link>

							<h3 className="text-[20px] md:text-[22px] mb-[15px] leading-[1.2]">
								<Link
									href="/blog/blog-details"
									className="transition duration-500 ease-in-out hover:text-[#1151f2]"
								>
									5 reasons why E-learning is the future of
									education in IT sector for business.
								</Link>
							</h3>

							<ul className="flex items-center space-x-[15px] sm:space-x-[20px] rtl:space-x-reverse">
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-user-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									<Link
										href="#"
										className="hover:text-[#F13A11]"
									>
										William Smith
									</Link>
								</li>
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									23 December 2023
								</li>
							</ul>
						</div>

						<div
							data-aos="fade-up"
							data-aos-delay="200"
							data-aos-duration="500"
							data-aos-once="true"
						>
							<Link
								href="/blog/blog-details"
								className="mb-[25px] block"
							>
								<Image src={blogImg2} alt="blog" />
							</Link>

							<h3 className="text-[20px] md:text-[22px] mb-[15px] leading-[1.2]">
								<Link
									href="/blog/blog-details"
									className="transition duration-500 ease-in-out hover:text-[#1151f2]"
								>
									12 reasons why E-learning is the future of
									education in IT sector for business.
								</Link>
							</h3>

							<ul className="flex items-center space-x-[15px] sm:space-x-[20px] rtl:space-x-reverse">
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-user-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									<Link
										href="#"
										className="hover:text-[#F13A11]"
									>
										John William
									</Link>
								</li>
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									24 December 2023
								</li>
							</ul>
						</div>

						<div
							data-aos="fade-up"
							data-aos-delay="300"
							data-aos-duration="500"
							data-aos-once="true"
						>
							<Link
								href="/blog/blog-details"
								className="mb-[25px] block"
							>
								<Image src={blogImg3} alt="blog" />
							</Link>

							<h3 className="text-[20px] md:text-[22px] mb-[15px] leading-[1.2]">
								<Link
									href="/blog/blog-details"
									className="transition duration-500 ease-in-out hover:text-[#1151f2]"
								>
									Top 12 website to learn python for latest &
									trending site to grow business
								</Link>
							</h3>

							<ul className="flex items-center space-x-[15px] sm:space-x-[20px] rtl:space-x-reverse">
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-user-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									<Link
										href="#"
										className="hover:text-[#F13A11]"
									>
										Saimon Danial
									</Link>
								</li>
								<li className="text-[13px] sm:text-[15px] flex items-center">
									<i className="ri-calendar-2-line text-[#F13A11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
									25 December 2023
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OurLatestBlogPosts;
