"use client";

import React from "react";
import GoogleMap from "./GoogleMap";

const ContactInfo = () => {
	return (
		<>
			<div className="pt-[42px]">
				<div className="container mx-auto">
					

					<div className="mb-[30px] grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
						<div data-aos="zoom-in-right"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true" className="bg-white p-2 md:p-4 lg:p-6 xl:p-8 2xl:p-10 flex items-center space-x-[20px] md:space-x-[30px] rtl:space-x-reverse transition duration-500 ease-in-out group hover:bg-black">
							<div className="bg-black text-white text-[45px] w-[84px] h-[84px] inline-block shrink-0 text-center leading-[84px] group-hover:bg-[#00000030] group-hover:text-[#fff]">
								<i className="ri-message-2-line"></i>
							</div>
							<div className="space-y-[5px]">
								
								<a
									href="mailto:ultimatearenato@gmail.com"
									className="break-all block font-bold text-[#000000] text-[15px] md:text-[18px] hover:text-white group-hover:text-[#fff]"
								>
									ultimatearenato@gmail.com
								</a>
							</div>
						</div>

						<div data-aos="zoom-in-right"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true" className="bg-white p-2 md:p-4 lg:p-6 xl:p-8 2xl:p-10 flex items-center space-x-[20px] md:space-x-[30px] rtl:space-x-reverse transition duration-500 ease-in-out group hover:bg-black">
							<div className="bg-black text-white text-[45px] w-[84px] h-[84px] inline-block shrink-0 text-center leading-[84px] group-hover:bg-[#00000030] group-hover:text-[#fff]">
								<i className="ri-phone-line"></i>
							</div>
							<div className="space-y-[5px]">
								
								<a
									href="tel:+39 392 407 3942
"
									className="block font-bold text-[#000000] text-[15px] md:text-[18px] hover:text-white group-hover:text-[#fff]"
								>
									+39 392 407 3942

								</a>
							</div>
						</div>

						<div data-aos="zoom-in-right"
              data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true" className="bg-white p-2 md:p-4 lg:p-6 xl:p-8 2xl:p-10  flex items-center space-x-[20px] md:space-x-[30px] rtl:space-x-reverse transition duration-500 ease-in-out group hover:bg-black">
							<div className="bg-black text-white text-[45px] w-[84px] h-[84px] inline-block shrink-0 text-center leading-[84px] group-hover:bg-[#00000030] group-hover:text-[#fff]">
								<i className="ri-map-pin-line"></i>
							</div>
							<div className="space-y-[5px]">
								<p className="block font-bold text-[#000000] text-[15px] md:text-[18px] hover:text-white group-hover:text-[#fff]">
								Vincenzo Bellini 24 , Moncalieri, Italy
								</p>
							</div>
						</div>
					</div>
					<div data-aos="zoom-out-up"  data-aos-delay="100"
              data-aos-duration="500"
              data-aos-once="true">
					<GoogleMap address="VIA VINCENZO BELLINI 24 Moncalieri" />
					</div>
					



					
				</div>
			</div>
		</>
	);
};

export default ContactInfo;
