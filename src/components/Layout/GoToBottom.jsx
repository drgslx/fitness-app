"use client";

import React, { useState, useEffect } from "react";

const GoToBottom = () => {
	const [showScroll, setShowScroll] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			// Get the current scroll position and viewport height
			const scrollTop = window.pageYOffset;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Show the button when the user is not at the bottom of the page
			if (scrollTop + windowHeight < documentHeight - 10) { // 10px is a small buffer
				setShowScroll(true);
			} else {
				setShowScroll(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Check visibility on mount as well
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollToBottom = () => {
		// Smoothly scroll to the bottom of the page
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
	};

	return (
		<>
			<div
				onClick={scrollToBottom}
				style={{
					display: showScroll ? "block" : "none",
					left: "40px",                // Center horizontally
					bottom: "0",            // Position from the bottom side
					transform: "translateX(-50%)", // Center horizontally by translating left by half of its width
					position: "fixed",         // Fix the position relative to the viewport
				}}
				className="bg-[#f13a11] hover:bg-[#1151f2] text-white fixed cursor-pointer  w-[36px] h-[32px] rounded-t-full text-center leading-[35px] text-[20px] z-50 "
			>
				<i className="ri-arrow-down-line"></i>
			</div>
		</>
	);
};

export default GoToBottom;
