"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { progressFloat } from "@/utils/progressFloat";
import { playerData } from "@/hooks/useVideoSrc";

const ProgressManager = ({ courseId, videos_count, slug }) => {
	const videoSRC = playerData((state) => state.videoSRC);
	const [pro, setPro] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const fetchProgrss = async () => {
			const url = `/api/progress/${courseId}`;
			const response = await axios.get(url);
			setPro(response.data.length);
		};

		fetchProgrss();
	}, [courseId, videoSRC]);

	return (
		<div className="mb-3">
			<p className="mb-2">
				Your progress{" "}
				<strong>
					{pro} of {videos_count} complete
				</strong>
				.{" "}
				{progressFloat(pro, videos_count) == 100 ? (
					<span
						onClick={() =>
							router.push(
								`/profile/certificate/${slug}/${courseId}`
							)
						}
						style={{
							textDecoration: "underline",
							color: "blue",
							fontWeight: "600",
							cursor: "pointer",
							fontSize: "12px",
						}}
					>
						Get certificate
					</span>
				) : (
					<span
						style={{
							textDecoration: "underline",
							color: "blue",
							fontWeight: "600",
							cursor: "pointer",
							fontSize: "12px",
						}}
					>
						Get certificate after complete
					</span>
				)}
			</p>

			<div className="w-full bg-gray-200 rounded-full">
				<div
					className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
					style={{
						width: `${progressFloat(pro, videos_count)}%`,
					}}
				>
					{" "}
					{progressFloat(pro, videos_count)}%
				</div>
			</div>
		</div>
	);
};

export default ProgressManager;
