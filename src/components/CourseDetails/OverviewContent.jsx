"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import user1 from "/public/images/user3.png";
import SocialShare from "./SocialShare";
import { calculateAverageRating } from "@/utils/generateStars";
import AddToCartButton from "./AddToCartButton";

const OverviewContent = ({
	id,
	slug,
	title,
	overview,
	before_price,
	regular_price,
	duration,
	access_time,
	image,
	lessons,
	user,
	category,
	enrolments,
	reviews,
}) => {
	const { averageRating } = calculateAverageRating(reviews);

	return (
		<>
			<div className="pt-[30px] space-y-[30px]">
				{/* Header */}
				<div>
					<ul className="mb-[20px] space-x-[10px] lg:space-x-[35px] rtl:space-x-reverse">
						{/* <li className="inline-block text-[13px] lg:text-[17px] transition duration-500 ease-in-out group-hover:text-white">
							<div className="flex items-center space-x-[5px] rtl:space-x-reverse">
								<div className="text-[#FCA120] text-[15px] sm:text-[20px] space-x-[1px] rtl:space-x-reverse">
									{[1, 2, 3, 4, 5].map((starIndex) => (
										<i
											key={starIndex}
											className={`ri-star-${
												starIndex <= averageRating
													? "fill"
													: "line"
											}`}
										></i>
									))}
								</div>
								<p className="relative top-[1px]">
									{averageRating ? averageRating : 0} Reviews
								</p>
							</div>
						</li> */}
						{/* <li className="inline-block text-[13px] lg:text-[17px] font-medium transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-stack-fill primaryText text-[17px] lg:text-[22px] mr-[5px] group-hover:text-white"></i>{" "}
							{category.name}
						</li> */}
						<li className="inline-block text-[13px] lg:text-[17px] font-medium transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-book-3-line primaryText text-[17px] lg:text-[22px] mr-[5px] group-hover:text-white"></i>{" "}
							{lessons} Lessons
						</li>
						<li className="inline-block text-[13px] lg:text-[17px] font-medium transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-graduation-cap-line primaryText text-[17px] lg:text-[22px] mr-[5px] group-hover:text-white"></i>{" "}
							{enrolments.length} Students
						</li>
					</ul>

					<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
						<Image
							src={user.image ? user.image : user1}
							width={150}
							height={150}
							alt="user"
							className="w-[40px] h-[40px] rounded-full"
						/>
						<div>
							<h3 className="text-[17px] lg:text-[19px]">
								<Link
									href="#"
									className="transition duration-500 ease-in-out hover:text-[#1151f2] group-hover:text-white"
								>
									{user.name}
								</Link>
							</h3>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="details-content space-y-[20px]">
					<h1>{title}</h1>

					<p>{overview}</p>
				</div>

				{/* <div className="sm:flex items-center justify-between space-y-[20px] sm:space-y-[0]">
					<AddToCartButton
						id={id}
						title={title}
						slug={slug}
						before_price={before_price}
						regular_price={regular_price}
						duration={duration}
						lessons={lessons}
						access_time={access_time}
						image={image}
						user={user.name}
					/>

					<div className="flex items-center space-x-[10px] rtl:space-x-reverse">
						<p className="text-[#000000] text-[16px] lg:text-[20px]">
							Share On:
						</p>

						<SocialShare />
					</div>
				</div> */}
			</div>
		</>
	);
};

export default OverviewContent;
