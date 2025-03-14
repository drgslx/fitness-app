"use client";

import React from "react";
import useFavourite from "@/hooks/useFavorite";

const HeartButton = ({ currentUser, courseId }) => {
	const { hasFauvorited, toggleFavourite } = useFavourite({
		courseId,
		currentUser,
	});
	return (
		<>
			{hasFauvorited ? (
				<button
					className="text-red-600 text-[30px]"
					onClick={toggleFavourite}
				>
					<i className="ri-heart-fill"></i>
				</button>
			) : (
				<button
					className="text-white text-[30px]"
					onClick={toggleFavourite}
				>
					<i className="ri-heart-line"></i>
				</button>
			)}
		</>
	);
};

export default HeartButton;
