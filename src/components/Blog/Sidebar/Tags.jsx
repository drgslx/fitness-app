"use client";

import React from "react";
import Link from "next/link";

const Tags = () => {
	return (
		<>
			<div>
				<h3 className="text-[#000000] font-bold text-[22px] leading-none mb-[15px]">
					Tags
				</h3>
				<ul className="space-y-[10px]">
					<li className="inline-block mr-[10px]">
						<Link
							href="#"
							className="text-[14px] text-[#000000] inline-block border border-[#1151f2] py-[14px] px-[25px] leading-none rounded-[30px] hover:bg-[#f13a11] hover:text-[#fff] hover:border-[#f13a11]"
						>
							Digital
						</Link>
					</li>
					<li className="inline-block mr-[10px]">
						<Link
							href="#"
							className="text-[14px] text-[#000000] inline-block border border-[#1151f2] py-[14px] px-[25px] leading-none rounded-[30px] hover:bg-[#f13a11] hover:text-[#fff] hover:border-[#f13a11]"
						>
							Data
						</Link>
					</li>
					<li className="inline-block mr-[10px]">
						<Link
							href="#"
							className="text-[14px] text-[#000000] inline-block border border-[#1151f2] py-[14px] px-[25px] leading-none rounded-[30px] hover:bg-[#f13a11] hover:text-[#fff] hover:border-[#f13a11]"
						>
							Business
						</Link>
					</li>
					<li className="inline-block mr-[10px]">
						<Link
							href="#"
							className="text-[14px] text-[#000000] inline-block border border-[#1151f2] py-[14px] px-[25px] leading-none rounded-[30px] hover:bg-[#f13a11] hover:text-[#fff] hover:border-[#f13a11]"
						>
							Coaching
						</Link>
					</li>
					<li className="inline-block mr-[10px]">
						<Link
							href="#"
							className="text-[14px] text-[#000000] inline-block border border-[#1151f2] py-[14px] px-[25px] leading-none rounded-[30px] hover:bg-[#f13a11] hover:text-[#fff] hover:border-[#f13a11]"
						>
							Trainer
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
};

export default Tags;
