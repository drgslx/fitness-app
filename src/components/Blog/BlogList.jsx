"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Image from "next/image";

import blogImg1 from "/public/images/blog-large-img1.jpg";
import blogImg2 from "/public/images/blog-large-img2.jpg";
import blogImg3 from "/public/images/blog-large-img3.jpg";
import blogImg4 from "/public/images/blog-large-img4.jpg";
import blogImg5 from "/public/images/blog-large-img5.jpg";
import blogImg6 from "/public/images/blog-large-img6.jpg";

const BlogList = () => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<div className="lg:col-span-2 space-y-[30px] lg:space-y-[50px]">
							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg1} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="/blog/blog-details"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										Ten benefits of rentals that may change
										your perspective system now.
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="#"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										23 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										03 Min Read
									</li>
								</ul>
							</div>

							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg2} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="#"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										The Best designer for this months you
										can hire me for your design system
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="/blog/blog-details"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										24 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										02 Min Read
									</li>
								</ul>
							</div>

							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg3} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="/blog/blog-details"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										Grow up your business for your next
										project design so that in this business.
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="/blog/blog-details"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										25 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										04 Min Read
									</li>
								</ul>
							</div>

							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg4} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="/blog/blog-details"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										Ten Benefits Of Rentals That May Change
										Your Perspective System Now.
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="/blog/blog-details"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										26 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										03 Min Read
									</li>
								</ul>
							</div>

							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg5} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="/blog/blog-details"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										Ten design system of rentals that may
										change your perspective system now.
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="/blog/blog-details"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										27 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										03 Min Read
									</li>
								</ul>
							</div>

							<div>
								<Link
									href="/blog/blog-details"
									className="mb-[25px] md:mb-[30px] block"
								>
									<Image src={blogImg6} alt="blog" />
								</Link>

								<h3 className="text-[20px] md:text-[22px] lg:text-[35px] xl:text-[42px] mb-[15px] leading-[1.2]">
									<Link
										href="#"
										className="transition duration-500 ease-in-out hover:text-[#f13a11]"
									>
										Ten Benefits Of Rentals That May Change
										Your Perspective System Now.
									</Link>
								</h3>

								<ul className="sm:flex items-center space-y-[5px] sm:space-y-[0] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-user-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="/blog/blog-details"
											className="hover:text-[#f13a11]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-calendar-2-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										28 December 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#f13a11] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										03 Min Read
									</li>
								</ul>
							</div>

							{/* Pagination */}
							<nav aria-label="Page navigation example">
								<ul className="space-x-[5px] rtl:space-x-reverse">
									<li className="inline-block">
										<a
											href="#"
											className="flex items-center justify-center text-[14px] md:text-[16px] border border-[#1151f2] h-[36px] w-[40px] md:w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#f13a11] hover:border-[#f13a11] hover:text-[#fff]"
										>
											<i className="ri-arrow-left-line"></i>
										</a>
									</li>

									<li className="inline-block">
										<a
											href="#"
											className="flex items-center justify-center text-[14px] md:text-[16px] border border-[#1151f2] h-[36px] w-[40px] md:w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#f13a11] hover:border-[#f13a11] hover:text-[#fff]"
										>
											1
										</a>
									</li>

									<li className="inline-block">
										<a
											href="#"
											className="flex items-center justify-center text-[14px] md:text-[16px] border border-[#1151f2] h-[36px] w-[40px] md:w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#f13a11] hover:border-[#f13a11] hover:text-[#fff]"
										>
											2
										</a>
									</li>

									<li className="inline-block">
										<a
											href="#"
											className="flex items-center justify-center text-[14px] md:text-[16px] border border-[#1151f2] h-[36px] w-[40px] md:w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#f13a11] hover:border-[#f13a11] hover:text-[#fff]"
										>
											3
										</a>
									</li>

									<li className="inline-block">
										<a
											href="#"
											className="flex items-center justify-center text-[14px] md:text-[16px] border border-[#1151f2] h-[36px] w-[40px] md:w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#f13a11] hover:border-[#f13a11] hover:text-[#fff]"
										>
											<i className="ri-arrow-right-line"></i>
										</a>
									</li>
								</ul>
							</nav>
						</div>

						<div>
							{/* Sidebar */}
							<Sidebar />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogList;
