"use client";

import Link from "next/link";
import Image from "next/image";

import error from "/public/images/error.png";

const Custom404 = () => {
	return (
		<>
			<div className="py-[60px] md:py-[80px] lg:py-[140px] bg-[#fff] text-center">
				<div className="container mx-auto">
					<Image src={error} alt="error-image" className="inline" />

					<h3 className="text-[#000000] text-[20px] md:text-[22px] lg:text-[30px] font-bold mt-[40px] mb-[15px] leading-[1.3]">
						Oops! That page can not be found
					</h3>

					<p className="text-[14px] md:text-[15px] lg:text-[16px] md:max-w-[540px] text-[#4c4c4c] leading-[1.7] ml-auto mr-auto mb-[15px] lg:mb-[18px]">
						The page you are looking for might have been removed had
						its name changed or is temporarily unavailable.
					</p>

					<Link
						href="/"
						className="bg-black text-white text-[14px] font-medium inline-block uppercase rounded-full py-[15px] px-[38px] transition duration-500 ease-in-out hover:bg-[#EF4335]"
					>
						Back To Home
					</Link>
				</div>
			</div>
		</>
	);
};

export default Custom404;
