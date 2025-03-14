"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import user1 from "/public/images/user1.png";
import user2 from "/public/images/user2.png";
import user3 from "/public/images/user3.png";
import { generateStars } from "@/utils/generateStars";

const ReviewsList = ({ reviews }) => {
	return (
		<>
			<div className="mb-[30px] md:mb-[40px] lg:mb-[70px]">
				<h2 className="text-[#000000] font-bold text-[20px] md:text-[22px] lg:text-[25px] mb-[20px] md:mb-[30px]">
					{reviews.length} Reviews
				</h2>
				<ul className="space-y-[20px] md:space-y-[30px]">
					{reviews.length > 0 ? (
						reviews.map((review, index) => (
							<li key={index} className="relative md:pl-[100px]">
								<Image
									src={
										review.user.image
											? review.user.image
											: user3
									}
									width={150}
									height={150}
									className="mb-[20px] md:mb-0 md:absolute md:left-0 w-[80px] h-[80px] md:top-0 rounded-full"
									alt="user"
								/>
								<div className="relative space-y-[15px]">
									<h4 className="text-[#000000] font-bold text-[20px] leading-none">
										{review.user.name}
									</h4>
									<p className="text-[15px]">
										{review.comment}
									</p>

									<div className="text-[#FCA120] text-[18px] space-x-[3px] rtl:space-x-reverse absolute top-[-15px] right-0 leading-none">
										{generateStars(review.rating)}
									</div>
								</div>
							</li>
						))
					) : (
						<h5>No reviews</h5>
					)}
				</ul>
			</div>
		</>
	);
};

export default ReviewsList;
