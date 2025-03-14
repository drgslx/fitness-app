"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseVideos = ({
	id: videoId,
	title,
	thumb_Image,
	short_id,
	onDelete,
}) => {
	return (
		<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<Image
				className="rounded-t-lg"
				src={thumb_Image ? thumb_Image : ""}
				alt=""
				width={750}
				height={500}
			/>
			<div className="p-5">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{title}
				</h5>

				<div className="flex items-center justify-between">
					Ascending: {short_id}
					<button
						onClick={() => onDelete(videoId)}
						className="
                        bg-orange-700
                        text-[#fff] 
                        text-[14px] 
                        font-semibold 
                        block 
                        py-[15px] 
                        sm:py-[17px] 
                        px-[21px] 
                        sm:px-[30px] 
                        leading-none 
                        border 
                        border-orange-700
                        transition 
                        duration-500 
                        ease-in-out 
                        hover:bg-black 
                        hover:border-[#000] 
                        hover:text-[#fff]
                    "
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default CourseVideos;
