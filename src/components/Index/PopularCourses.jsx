"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import courseImg1 from "/public/images/course-img1.jpg";
import courseImg2 from "/public/images/course-img2.jpg";
import courseImg3 from "/public/images/course-img3.jpg";
import courseImg4 from "/public/images/course-img4.jpg";
import courseImg5 from "/public/images/course-img5.jpg";
import courseImg6 from "/public/images/course-img6.jpg";

import user1 from "/public/images/user1.png";
import user2 from "/public/images/user2.png";
import user3 from "/public/images/user3.png";
import user4 from "/public/images/user4.png";
import user5 from "/public/images/user5.png";
import CourseCard from "../Shared/CourseCard";

const PopularCourses = ({ courses }) => {
	// console.log(courses);
	const pagination = {
		clickable: true,
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + (index + 1) + "</span>";
		},
	};

	return (
		<>
			<div className="bg-black pt-[50px] md:pt-[60px] lg:pt-[140px] overflow-hidden">
				<div className="px-[15px] 2xl:px-[0] relative overflow-hidden content-right-overflow">
					

					<Swiper
						slidesPerView={1}
						spaceBetween={25}
						autoplay={{
							delay: 5000,
							pauseOnMouseEnter: true,
							disableOnInteraction: true,
						}}
						pagination={pagination}
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
							1650: {
								slidesPerView: 4,
							},
						}}
						modules={[Pagination, Autoplay]}
						className="popular-courses"
					>
						{courses.map((course, index) => (
							<SwiperSlide key={index}>
								<CourseCard
									{...course}
									backgroundClass="bg-black"
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	);
};

export default PopularCourses;
