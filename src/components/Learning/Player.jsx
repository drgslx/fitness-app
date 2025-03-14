"use client";

import React from "react";
import { playerData } from "@/hooks/useVideoSrc";
import ReactPlayer from "react-player";
import axios from "axios";

const Player = ({ id: courseId }) => {
	const videoSrc = playerData((state) => state.videoSRC);
	const videoId = playerData((state) => state.videoId);

	const handleProgress = async () => {
		const data = { videoId };
		await axios.post(`/api/progress/${courseId}`, data);
	};

	return (
		<div className="video-content-box">
			{videoSrc && (
				<ReactPlayer
					url={videoSrc}
					controls
					playing={true}
					width="100%"
					height="100%"
					onStart={handleProgress}
				/>
			)}
		</div>
	);
};

export default Player;
