"use client";

import React, { useState, useEffect } from "react";

const BackToTop = () => {
	const [showScroll, setShowScroll] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", checkScrollTop);
		return function cleanup() {
			window.removeEventListener("scroll", checkScrollTop);
		};
	});

	const checkScrollTop = () => {
		if (!showScroll && window.pageYOffset > 100) {
			setShowScroll(true);
		} else if (showScroll && window.pageYOffset <= 100) {
			setShowScroll(false);
		}
	};

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<div
				onClick={scrollTop}
				style={{
					display: showScroll ? "block" : "none",
				}}
				className="bg-[#1151f2] text-white fixed right-[30px] bottom-[0] cursor-pointer w-[36px] h-[32px] rounded-t-full text-center leading-[35px] text-[20px] z-50 hover:bg-[#EF4335]"
			>
				<i className="ri-arrow-up-line"></i>
			</div>
		</>
	);
};

export default BackToTop;
