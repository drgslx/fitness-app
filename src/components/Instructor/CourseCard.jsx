"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import user1 from "/public/images/user1.png";
import { useParams } from "next/navigation";
import HeartButton from "../HeartButton";
import { calculateAverageRating } from "@/utils/generateStars";

const CourseCard = ({
	id,
	title,
	slug,
	image,
	regular_price,
	before_price,
	category,
	lessons,
	user,
	reviews,
	currentUser,
}) => {
	const { lang } = useParams();
	const { averageRating } = calculateAverageRating(reviews);
	return (
		<div>
			<div className="bg-black relative group">
				<div>
					<Link href={`/course/${slug}`}>
						<Image
							src={image}
							alt="course"
							width={900}
							height={790}
						/>
					</Link>
					{/* <div className="absolute top-[20px] right-[20px]">
						<HeartButton courseId={id} currentUser={currentUser} />
					</div> */}
				</div>

				<div className="headingFontFamily absolute top-[20px] left-[20px] z-1 primaryBg text-white font-semibold text-[16px] lg:text-[22px] pt-[14px] pb-[10px] px-[16px] leading-none">
					<span className="discount-price line-through text-[13px] lg:text-[18px] mr-2 rtl:mr-0 rtl:ml-2">
						${before_price}
					</span>{" "}
					${regular_price}
				</div>

				<div className="bg-black py-[30px] sm:py-[35px] px-[20px] sm:px-[25px] -mt-[1px] border border-[#1151f2] group-hover:bg-#f13a11 transition duration-500 ease-in-out group-hover:border-[#1151f2]">
					<ul className="mb-[20px] space-x-[10px] lg:space-x-[15px] rtl:space-x-reverse">
						<li className="inline-block text-[13px] lg:text-[15px] transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-star-fill text-[#FCA120] text-[18px] mr-[3px]"></i>{" "}
							{averageRating ? averageRating : "0.0"}
						</li>
						<li className="inline-block text-[13px] lg:text-[15px] transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-stack-fill primaryText text-[18px] mr-[3px] group-hover:text-white"></i>{" "}
							{category.name}
						</li>
						<li className="inline-block text-[13px] lg:text-[15px] transition duration-500 ease-in-out group-hover:text-white">
							<i className="ri-book-3-line primaryText text-[18px] mr-[3px] group-hover:text-white"></i>{" "}
							{lessons}(Lessons)
						</li>
					</ul>

					<h3 className="text-[20px] lg:text-[22px] leading-[1.3] mb-[20px]">
						<Link
							href={`/course/${slug}`}
							className="transition duration-500 ease-in-out hover:text-[#1151f2] group-hover:text-white"
						>
							{title}
						</Link>
					</h3>

					<div className="flex justify-between items-center border-t border-[#1151f2] pt-[25px] space-x-[15px] rtl:space-x-reverse">
						<div className="flex items-center space-x-[15px] ">
							<Image
								src={user.image ? user.image : user1}
								alt="user"
								className="w-[40px] h-[40px] rounded-full"
								width={150}
								height={150}
							/>
							<h3 className="text-[17px] lg:text-[19px]">
								<div className="transition duration-500 ease-in-out hover:text-[#1151f2] group-hover:text-white">
									{user.name}
								</div>
							</h3>
						</div>

						<div className="group-hover:text-white text-[25px]">
							<Link
								href={`/${lang}/instructor/course/${id}/edit`}
							>
								<i className="ri-edit-box-line"></i>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
