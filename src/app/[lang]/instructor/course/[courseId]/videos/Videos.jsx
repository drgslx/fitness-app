"use client";

import CourseVideos from "@/components/Instructor/CourseVideos";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Nav from "@/components/Instructor/Nav";

const Videos = ({ videos }) => {
	const router = useRouter();
	const handleDelete = async (videoId) => {
		try {
			const url = `/api/course/${videoId}/video`;
			const response = await axios.delete(url);
			toast.success(response.data.message);
			router.refresh();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
	return (
		<div className="py-[50px] md:py-[60px] lg:py-[140px]">
			<div className="container mx-auto lg:max-w-[1150px]">
				<Nav />
				<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
					{videos.length > 0
						? videos.map((video) => (
								<CourseVideos
									key={video.id}
									{...video}
									onDelete={() => handleDelete(video.id)}
								/>
						  ))
						: "Empty"}
				</div>
			</div>
		</div>
	);
};

export default Videos;
