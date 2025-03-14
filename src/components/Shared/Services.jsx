"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import service1 from "/public/images/life-coach/service1.jpg";
import service2 from "/public/images/life-coach/service2.jpg";
import service3 from "/public/images/life-coach/service3.jpg";
import service4 from "/public/images/life-coach/service4.jpg";

const Services = () => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1760px]">
					<h1 className="text-center text-[30px] md:text-[50px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px]">
						What I provide for people
					</h1>

					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
						<div className="relative group">
							<div className="relative pt-[20px] pl-[20px] before:content-[''] before:absolute before:left-0 before:top-0 before:bg-[#092C84] before:w-[95%] before:h-[95%] group-hover:before:bg-[#F13A11]">
								<Link
									href="/services/service-details"
									className="relative"
								>
									<Image src={service1} alt="service" />
								</Link>
							</div>

							<div className="pl-[25px] pt-[25px]">
								<h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
									<Link
										href="/services/service-details"
										className="transition duration-500 ease-in-out hover:text-[#F13A11]"
									>
										Executive Coaching Sessions
									</Link>
								</h3>

								<p className="mb-[25px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force.
								</p>

								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#F13A11] hover:border-[#F13A11] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</div>

						<div className="relative group">
							<div className="relative pt-[20px] pl-[20px] before:content-[''] before:absolute before:left-0 before:top-0 before:bg-[#092C84] before:w-[95%] before:h-[95%] group-hover:before:bg-[#F13A11]">
								<Link
									href="/services/service-details"
									className="relative"
								>
									<Image src={service2} alt="service" />
								</Link>
							</div>

							<div className="pl-[25px] pt-[25px]">
								<h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
									<Link
										href="/services/service-details"
										className="transition duration-500 ease-in-out hover:text-[#F13A11]"
									>
										Business Education In This Sector
									</Link>
								</h3>

								<p className="mb-[25px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force.
								</p>

								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#F13A11] hover:border-[#F13A11] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</div>

						<div className="relative group">
							<div className="relative pt-[20px] pl-[20px] before:content-[''] before:absolute before:left-0 before:top-0 before:bg-[#092C84] before:w-[95%] before:h-[95%] group-hover:before:bg-[#F13A11]">
								<Link
									href="/services/service-details"
									className="relative"
								>
									<Image src={service3} alt="service" />
								</Link>
							</div>

							<div className="pl-[25px] pt-[25px]">
								<h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
									<Link
										href="/services/service-details"
										className="transition duration-500 ease-in-out hover:text-[#F13A11]"
									>
										Learn Sychologycal Science Sector
									</Link>
								</h3>

								<p className="mb-[25px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force.
								</p>

								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#F13A11] hover:border-[#F13A11] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</div>

						<div className="relative group">
							<div className="relative pt-[20px] pl-[20px] before:content-[''] before:absolute before:left-0 before:top-0 before:bg-[#092C84] before:w-[95%] before:h-[95%] group-hover:before:bg-[#F13A11]">
								<Link
									href="/services/service-details"
									className="relative"
								>
									<Image src={service4} alt="service" />
								</Link>
							</div>

							<div className="pl-[25px] pt-[25px]">
								<h3 className="text-[20px] lg:text-[26px] leading-[1.3] mb-[10px]">
									<Link
										href="/services/service-details"
										className="transition duration-500 ease-in-out hover:text-[#F13A11]"
									>
										Learn Business Orientaton
									</Link>
								</h3>

								<p className="mb-[25px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force.
								</p>

								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#F13A11] hover:border-[#F13A11] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Services;
