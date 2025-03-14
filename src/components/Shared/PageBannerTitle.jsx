"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const PageBannerTitle = ({
	title,
	homeText,
	homeUrl,
	
}) => {
	return (
		<div className="bg-white py-[25px]">
			<div className="container mx-auto relative">
				<div className="relative text-center">
					<h2 className="text-[#000000] text-[25px] md:text-[35px] lg:text-[40px] xl:text-[48px] leading-[1.1] mb-[5px]">
						{title}
					</h2>

					<ul className="space-x-[25px] rtl:space-x-reverse">
						<li className="inline-block text-[#1151f2] relative before:content-['/'] before:absolute before:right-[-17px] rtl:before:right-auto rtl:before:left-[-17px] before:top-0">
							<Link
								href={homeUrl}
								className="text-[#000000] hover:text-[#1151f2]"
							>
								{homeText}
							</Link>
						</li>
						<li className="inline-block text-[#1151f2] relative before:content-['/'] before:absolute before:right-[-17px] rtl:before:right-auto rtl:before:left-[-17px] before:top-0 last:before:hidden">
							{title}
						</li>
					</ul>
				</div>

				
			</div>
		</div>
	);
};

export default PageBannerTitle;
