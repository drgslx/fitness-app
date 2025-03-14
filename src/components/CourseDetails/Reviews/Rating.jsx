"use client";

import {
	calculateAverageRating,
	generateStarsSummary,
} from "@/utils/generateStars";
import React, { useState } from "react";

const Rating = ({ reviews }) => {
	const [rating, setRating] = useState(0);
	const {
		count1,
		count2,
		count3,
		count4,
		count5,
		percent1,
		percent2,
		percent3,
		percent4,
		percent5,
	} = generateStarsSummary(reviews);

	const { averageRating } = calculateAverageRating(reviews);

	return (
		<>
			<div>
				<div className="grid items-center gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					<div className="bg-white px-[20px] py-[40px] text-center">
						<h1 className="text-[30px] md:text-[50px] lg:text-[60px] xl:text-[70px] 2xl:text-[80px] leading-none">
							{averageRating ? averageRating : 0}
						</h1>

						<div className="text-[#FCA120] text-[30px] space-x-[5px] mb-[10px]">
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

						<p>Total Reviews {reviews.length}</p>
					</div>

					<div className="lg:col-span-2">
						<div className="space-y-[15px]">
							<div className="flex items-center space-x-[10px]">
								<div className="flex items-center">
									<i className="ri-star-fill text-[#FCA120] text-[18px] mr-1"></i>{" "}
									5{" "}
								</div>

								<div className="w-full bg-[#CBE2D0] h-[12px]">
									<div
										className="bg-#f13a11 h-[12px]"
										style={{ width: `${percent5}%` }}
									></div>
								</div>

								<div>{count5}</div>
							</div>

							<div className="flex items-center space-x-[10px]">
								<div className="flex items-center">
									<i className="ri-star-fill text-[#FCA120] text-[18px] mr-1"></i>{" "}
									4{" "}
								</div>

								<div className="w-full bg-[#CBE2D0] h-[12px]">
									<div
										className="bg-#f13a11 h-[12px]"
										style={{ width: `${percent4}%` }}
									></div>
								</div>

								<div>{count4}</div>
							</div>

							<div className="flex items-center space-x-[10px]">
								<div className="flex items-center">
									<i className="ri-star-fill text-[#FCA120] text-[18px] mr-1"></i>{" "}
									3{" "}
								</div>

								<div className="w-full bg-[#CBE2D0] h-[12px]">
									<div
										className="bg-#f13a11 h-[12px]"
										style={{ width: `${percent3}%` }}
									></div>
								</div>

								<div>{count3}</div>
							</div>

							<div className="flex items-center space-x-[10px]">
								<div className="flex items-center">
									<i className="ri-star-fill text-[#FCA120] text-[18px] mr-1"></i>{" "}
									2{" "}
								</div>

								<div className="w-full bg-[#CBE2D0] h-[12px]">
									<div
										className="bg-#f13a11 h-[12px]"
										style={{ width: `${percent2}%` }}
									></div>
								</div>

								<div>{count2}</div>
							</div>

							<div className="flex items-center space-x-[10px]">
								<div className="flex items-center">
									<i className="ri-star-fill text-[#FCA120] text-[18px] mr-1"></i>{" "}
									1
								</div>

								<div className="w-full bg-[#CBE2D0] h-[12px]">
									<div
										className="bg-#f13a11 h-[12px]"
										style={{ width: `${percent1}%` }}
									></div>
								</div>

								<div>{count1}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Rating;
