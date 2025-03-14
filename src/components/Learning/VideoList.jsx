"use client";

import React from "react";
import { playerData } from "@/hooks/useVideoSrc";

const VideoList = ({ id, title, short_id, video_url, video_length, onSrc }) => {
	const { videoId } = playerData((state) => state);

	return (
		<li
			style={{ cursor: "pointer" }}
			onClick={() => onSrc(video_url, id)}
			className={`bg-[#f5f5f5] p-[12px] ${
				videoId && videoId === id ? "bg-blue-200" : null
			}`}
		>
			{short_id}. {title}
			<div className="text-[13px]">
				<i className="ri-time-line"></i> {video_length}
			</div>
		</li>
	);
};

export default VideoList;
