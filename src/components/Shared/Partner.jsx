"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import pratnerLogo2 from "/public/images/partners/partner-black-logo2.png";
import pratnerLogo3 from "/public/images/partners/partner-black-logo3.png";
import pratnerLogo1 from "/public/images/partners/partner-black-logo1.png";
import pratnerLogo4 from "/public/images/partners/partner-black-logo4.png";
import pratnerLogo5 from "/public/images/partners/partner-black-logo5.png";

const Partner = () => {
	return (
		<>
			<div className="py-[50px] md:py-[80px] lg:py-[140px]">
				<div className="container mx-auto">
					<Swiper
						spaceBetween={30}
						autoplay={{
							delay: 5000,
							pauseOnMouseEnter: true,
							disableOnInteraction: true,
						}}
						breakpoints={{
							0: {
								slidesPerView: 2,
							},
							576: {
								slidesPerView: 3,
							},
							768: {
								slidesPerView: 4,
							},
							1200: {
								slidesPerView: 5,
							},
						}}
						modules={[Autoplay]}
						className="pratner-slider"
					>
						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo1}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo2}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo3}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo4}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo5}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo2}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>

						<SwiperSlide className="text-center">
							<Image
								src={pratnerLogo4}
								alt="pratner"
								className="inline-block"
							/>
						</SwiperSlide>
					</Swiper>
				</div>
			</div>
		</>
	);
};

export default Partner;
