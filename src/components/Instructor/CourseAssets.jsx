"use client";

import React from "react";

const CourseAssets = ({ id: assetId, lecture_name, asset_zip, onDelete }) => {
	return (
		<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<svg
				className="w-6 h-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 14 20"
			>
				<path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
			</svg>
			<a href="#">
				<h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{lecture_name}
				</h5>
			</a>

			<div className="flex justify-between">
				<button
					onClick={() => window.open(asset_zip)}
					className="
                                    bg-lime-500
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
                                    border-lime-500
                                    transition 
                                    duration-500 
                                    ease-in-out 
                                    hover:bg-black 
                                    hover:border-[#000] 
                                    hover:text-[#fff]
                                "
				>
					Download
				</button>
				<button
					onClick={() => onDelete(assetId)}
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
	);
};

export default CourseAssets;
