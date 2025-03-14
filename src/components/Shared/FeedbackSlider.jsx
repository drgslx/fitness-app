"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const FeedbackSlider = ({ testimonials = [] }) => {
	const pagination = {
		clickable: true,
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + (index + 1) + "</span>";
		},
	};

	return (
		<>
			<div className="bg-[#161616] px-[15px] lg:px-[0] py-[50px] md:py-[60px] lg:py-[84px] overflow-hidden">
				<div className="container mx-auto">
					<h1 className="text-[30px] sm:text-[60px] md:text-[70px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[920px]">
					I nostri clienti soddisfatti
					</h1>
				</div>

				<div className="">
					<Swiper
						slidesPerView={1}
						spaceBetween={25}
						centeredSlides={true}
						grabCursor={true}
						pagination={pagination}
						autoplay={{
							delay: 5000,
							pauseOnMouseEnter: true,
							disableOnInteraction: true,
						}}
						breakpoints={{
							0: {
								slidesPerView: 1,
							},
							768: {
								slidesPerView: 2,
							},
							1200: {
								slidesPerView: 3,
							},
						}}
						modules={[Pagination, Autoplay]}
						className="feedback-slider"
					>
						{testimonials.map((testimonial, index) => (
							<SwiperSlide key={index}>
								<div className="bg-black group border border-[#1151f2] p-[20px] md:p-[30px] lg:p-[50px] transition delay-100 duration-300 ease-in-out hover:bg-#f13a11 hover:border-[#1151f2]">
									<div className="text-[#FCA120] text-[20px] mb-[15px] space-x-[5px] rtl:space-x-reverse">
										<i className="ri-star-fill"></i>
										<i className="ri-star-fill"></i>
										<i className="ri-star-fill"></i>
										<i className="ri-star-fill"></i>
										<i className="ri-star-fill"></i>
									</div>

									<p className="font-semibold text-[16px] transition delay-100 duration-300 ease-in-out group-hover:text-white">
										{testimonial.description}
									</p>

									<div className="flex items-center justify-between mt-[30px] md:mt-[40px] space-x-[15px] rtl:space-x-reverse">
										<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
											<Image
												src={testimonial.image}
												alt="user"
												className="w-[58px] h-[58px] rounded-full"
												width={84}
												height={84}
											/>
											<div>
												<h3 className="text-[19px] leading-none transition delay-100 duration-300 ease-in-out group-hover:text-white">
													{testimonial.name}
												</h3>
												<p className="text-[14px] transition delay-100 duration-300 ease-in-out group-hover:text-white">
													{testimonial.designation}
												</p>
											</div>
										</div>

										{/* Quote Icon */}
										<div>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="46"
												height="45"
												viewBox="0 0 46 45"
												fill="none"
											>
												<g clipPath="url(#clip0_1_2643)">
													<path
														d="M0.853516 5.625V39.375L17.7546 22.5V5.625H0.853516Z"
														fill="#1151f2"
														className="group-hover:fill-[#fff]"
													/>
													<path
														d="M29.022 5.625V39.375L45.923 22.5V5.625H29.022Z"
														fill="#1151f2"
														className="group-hover:fill-[#fff]"
													/>
												</g>
												<defs>
													<clipPath id="clip0_1_2643">
														<rect
															width="45.0694"
															height="45"
															fill="white"
															transform="translate(0.853516)"
														/>
													</clipPath>
												</defs>
											</svg>
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	);
};

export default FeedbackSlider;
