"use client";

import CourseAsset from "@/components/Learning/CourseAsset";
import CourseOverview from "@/components/Learning/CourseOverview";
import React, { useState } from "react";

const Content = ({ id, overview, reviews }) => {
	const [tab, setTab] = useState("overview");

	return (
		<>
			<ul className="flex space-x-[20px] border-b-2 border-indigo-300">
				<li
					className={`cursor-pointer py-[10px] px-[15px] ${
						tab == "overview"
							? "bg-#f13a11 text-white"
							: "bg-white"
					}`}
					onClick={(e) => {
						e.preventDefault();
						setTab("overview");
					}}
				>
					Overview
				</li>
				<li
					onClick={(e) => {
						e.preventDefault();
						setTab("asset");
					}}
					className={`cursor-pointer py-[10px] px-[15px]  ${
						tab == "asset" ? "bg-#f13a11 text-white" : ""
					}`}
				>
					Assets
				</li>
			</ul>

			{tab == "asset" ? (
				<CourseAsset courseId={id} />
			) : (
				<CourseOverview overview={overview} />
			)}
		</>
	);
};

export default Content;
