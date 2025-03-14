"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import icon1 from "/public/images/icon1.png";
import icon2 from "/public/images/icon2.png";
import icon3 from "/public/images/icon3.png";
import icon4 from "/public/images/icon4.png";
import icon5 from "/public/images/icon5.png";

const Services = () => {
	return (
		<>
			<div className="bg-black py-[50px] md:py-[80px] lg:py-[140px]">
				<div className="container lg:p-0 mx-auto max-w-[2200px]">
					{/* <Swiper
						slidesPerView={1}
						centeredSlides={true}
						spaceBetween={25}
						grabCursor={true}
						autoplay={{
							delay: 5000,
							pauseOnMouseEnter: true,
							disableOnInteraction: true,
						}}
						breakpoints={{
							0: {
								slidesPerView: 0,
							},
							768: {
								slidesPerView: 2,
							},
							1200: {
								slidesPerView: 3,
							},
							1400: {
								slidesPerView: 4,
							},
						}}
						modules={[Autoplay]}
						className="features-slider"
					>
						<SwiperSlide>
							<div className="border border-[#1151f2] p-[35px] hover:border-[#f13a11]  transition delay-100 duration-300 ease-in-out hover:-top-[10px]">
								<Image
									src={icon1}
									alt="icon"
									className="mb-[30px]"
								/>
								<h3 className="text-[22px] md:text-[24px] lg:text-[26px] mb-[15px] leading-[1.2]">
									Support & Motivation
								</h3>
								<p className="mb-[30px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force. There nothing for me is a
									here now. I want to learn the ways of the
									Force in this sector.
								</p>
								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="border border-[#1151f2] p-[35px]  hover:border-[#f13a11] transition delay-100 duration-300 ease-in-out hover:-top-[10px]">
								<Image
									src={icon2}
									alt="icon"
									className="mb-[30px]"
								/>
								<h3 className="text-[22px] md:text-[24px] lg:text-[26px] mb-[15px] leading-[1.2]">
									Nutrition Strategies Food
								</h3>
								<p className="mb-[30px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force. There nothing for me is a
									here now. I want to learn the ways of the
									Force in this sector.
								</p>
								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="border border-[#1151f2] p-[35px]  hover:border-[#f13a11] transition delay-100 duration-300 ease-in-out hover:-top-[10px]">
								<Image
									src={icon3}
									alt="icon"
									className="mb-[30px]"
								/>
								<h3 className="text-[22px] md:text-[24px] lg:text-[26px] mb-[15px] leading-[1.2]">
									Lifelong Learning
								</h3>
								<p className="mb-[30px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force. There nothing for me is a
									here now. I want to learn the ways of the
									Force in this sector.
								</p>
								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="border border-[#1151f2] p-[35px]  hover:border-[#f13a11] transition delay-100 duration-300 ease-in-out hover:-top-[10px]">
								<Image
									src={icon4}
									alt="icon"
									className="mb-[30px]"
								/>
								<h3 className="text-[22px] md:text-[24px] lg:text-[26px] mb-[15px] leading-[1.2]">
									Workout Routines
								</h3>
								<p className="mb-[30px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force. There nothing for me is a
									here now. I want to learn the ways of the
									Force in this sector.
								</p>
								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="border border-[#1151f2] p-[35px]  hover:border-[#f13a11] transition delay-100 duration-300 ease-in-out hover:-top-[10px]">
								<Image
									src={icon5}
									alt="icon"
									className="mb-[30px]"
								/>
								<h3 className="text-[22px] md:text-[24px] lg:text-[26px] mb-[15px] leading-[1.2]">
									Healthy Body Shape
								</h3>
								<p className="mb-[30px]">
									I want to come with you to Alderaan. There
									nothing for me here now. I want to learn the
									ways of the Force. There nothing for me is a
									here now. I want to learn the ways of the
									Force in this sector.
								</p>
								<Link
									href="/services/service-details"
									className="text-[#000000] text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#000000] transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff]"
								>
									More Details{" "}
									<i className="ri-arrow-right-up-line"></i>
								</Link>
							</div>
						</SwiperSlide>
					</Swiper> */}
				</div>
			</div>
		</>
	);
};

export default Services;
