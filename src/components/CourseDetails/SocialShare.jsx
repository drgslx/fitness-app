"use client";

import React from "react";

const SocialShare = () => {
	return (
		<ul className="space-x-[10px] rtl:space-x-reverse">
			<li className="inline-block">
				<a
					href="https://www.facebook.com/"
					target="_black"
					className="bg-[#051F0D1A] text-[#051F0D] inline-block w-[32px] h-[32px] leading-[32px] text-center rounded-full transition duration-500 ease-in-out hover:bg-[#051F0D] hover:text-[#fff]"
				>
					<i className="ri-facebook-fill"></i>
				</a>
			</li>

			<li className="inline-block">
				<a
					href="https://www.instagram.com/"
					target="_black"
					className="bg-[#051F0D1A] text-[#051F0D] inline-block w-[32px] h-[32px] leading-[32px] text-center rounded-full transition duration-500 ease-in-out hover:bg-[#051F0D] hover:text-[#fff]"
				>
					<i className="ri-instagram-fill"></i>
				</a>
			</li>
		</ul>
	);
};

export default SocialShare;
