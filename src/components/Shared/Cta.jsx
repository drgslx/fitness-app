"use client";

import React from "react";
import Link from "next/link";


const Cta = () => {
	return (
		<>
			<div className="  bg-[#161616]  md:py-[84px]">
				<div className= "sm:p-6 md:p-8  container mx-auto relative">
					<div className="grid items-center gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
						<div>
							<h2 className="text-[30px] font-semibold text-white leading-[1.2]">
							Siamo pronti a offrire il meglio agli studenti, dovresti unirti a noi per imparare.
							</h2>
						</div>

						<div className="md:text-end">
							<Link
								href="/disciplines"
								className="text-white text-[14px] font-medium inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#ffffff] transition duration-500 ease-in-out hover:bg-black hover:border-[#f13a11] hover:text-[#fff]"
							>
								Saperne di più{" "}
								<i className="ri-arrow-right-up-line"></i>
							</Link>
						</div>
					</div>

					
				</div>
			</div>
		</>
	);
};

export default Cta;
