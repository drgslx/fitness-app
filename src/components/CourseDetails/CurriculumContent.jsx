"use client";

import React, { useState } from "react";
import FsLightbox from "fslightbox-react";

const CurriculumContent = ({ what_you_will_learn, duration, videos }) => {
	// To open the lightbox change the value of the "toggler" prop.
	const [toggler, setToggler] = useState(false);
	const [videoSrc, setVideoSrc] = useState("");

	return (
		<>
			{/* Use here youtube Embed video link */}
			<FsLightbox toggler={toggler} sources={[videoSrc]} />

			<div className="pt-[30px] space-y-[30px]">
				<div className="space-y-[15px]">
					<h2 className="font-bold text-[22px] md:text-[25px] leading-none">
						Curriculum
					</h2>
					<p>{what_you_will_learn}</p>
				</div>

				<div className="bg-black p-[20px] sm:p-[30px] space-y-[15px]">
					<div className="flex item-center justify-between border-b border-[#e3e3e3] pb-[10px] mb-[30px]">
						<h3 className="font-bold text-[22px] md:text-[25px] leading-none">
							Duration
						</h3>
						<div className="font-bold text-[22px] md:text-[25px] leading-none">
							{duration}
						</div>
					</div>

					<ul>
						{videos.map((video, index) => (
							<li
								key={index}
								className="sm:flex items-center justify-between border-b border-[#e3e3e3] pb-[10px] mb-[10px] last:pb-0 last:border-none last:mb-0 space-y-[10px] sm:space-y-[0]"
							>
								<div className="font-medium text-[14px] md:text-[15px]">
									<i className="ri-video-line text-[20px] mr-1"></i>{" "}
									{video.title}
								</div>

								<div className="flex items-center justify-between space-x-[15px] rtl:space-x-reverse">
									{video.is_preview ? (
										<div
											className="bg-#f13a11 text-[#fff] leading-none px-[15px] py-[5px] rounded-full text-[12px] md:text-[13px] cursor-pointer hover:bg-black"
											onClick={() => {
												setVideoSrc(video.video_url);
												setToggler(!toggler);
											}}
										>
											Preview
										</div>
									) : (
										<div className="bg-[#cdc9c9] text-[#000] leading-none px-[5px] py-[5px] rounded-full text-[12px] md:text-[13px]">
											<i className="ri-lock-line"></i>
										</div>
									)}

									<p className="text-[12px] md:text-[14px]">
										{video.video_length}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default CurriculumContent;
