"use client";

import React from "react";
import Image from "next/image";

import process1 from "/public/images/process1.png";
import process2 from "/public/images/process2.png";
import process3 from "/public/images/process3.png";

import shape6 from "/public/images/shape6.png";
import shape7 from "/public/images/shape7.png";

const WorkingProcess = () => {
	return (
		<>
			<div className="bg-[#f13a11] py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<h1 className="text-white text-center text-[30px] sm:text-[40px] md:text-[50px] lg:text-[80px] sm:tracking-[-1.2px] leading-none mb-[30px] md:mb-[50px] lg:max-w-[600px] mx-auto">
						How I’m working
					</h1>

					<div className="relative space-y-[30px] lg:space-y-[50px]">
						<div
							className="relative z-10 border border-[#999] p-[25px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
							data-aos="fade-in"
							data-aos-delay="100"
							data-aos-duration="800"
							data-aos-once="true"
						>
							<div className="grid items-center gap-[30px] lg:gap-[0] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
								<div>
									<Image src={process1} alt="process" />
								</div>

								<div className="text-[#00000078] space-y-[15px] lg:pl-[30px] rtl:lg:pl-0 rtl:lg:pr-[30px] max-w-[496px]">
									<h3 className="text-white text-[22px] md:text-[25px] lg:text-[30px] leading-[1.1]">
										<span className="text-[#00000078]">
											01.
										</span>{" "}
										<span className="text-[#FCA120]">
											Meting
										</span>{" "}
										for your problem
									</h3>

									<p className="text-[15px]">
										Learn about how them you went down
										prying the wedding to ring off his cold,
										dead finger. I don’t know what you did,
										Fry, but once again.
									</p>

									<p className="text-[15px]">
										You screwed up! Now all the planets are
										gonna start cracking wise about our
										mamas.
									</p>
								</div>
							</div>
						</div>

						<div
							className="relative z-10 border border-[#999] p-[25px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
							data-aos="fade-in"
							data-aos-delay="200"
							data-aos-duration="800"
							data-aos-once="true"
						>
							<div className="grid items-center gap-[30px] lg:gap-[0] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
								<div className="text-[#00000078] space-y-[15px] xl:pl-[150px] rtl:xl:pl-0 rtl:xl:pr-[150px] max-w-[610px]">
									<h3 className="text-white text-[22px] md:text-[25px] lg:text-[30px] leading-[1.1]">
										<span className="text-[#00000078]">
											02.
										</span>{" "}
										<span className="text-[#FCA120]">
											Analysis
										</span>{" "}
										your problem
									</h3>

									<p className="text-[15px]">
										Learn about how them you went down
										prying the wedding to ring off his cold,
										dead finger. I don’t know what you did,
										Fry, but once again.
									</p>

									<p className="text-[15px]">
										You screwed up! Now all the planets are
										gonna start cracking wise about our
										mamas.
									</p>
								</div>

								<div>
									<Image src={process2} alt="process" />
								</div>
							</div>
						</div>

						<div
							className="relative z-10 border border-[#999] p-[25px] sm:p-[40px] md:p-[30px] xl:p-[0] xl:border-none"
							data-aos="fade-in"
							data-aos-delay="300"
							data-aos-duration="800"
							data-aos-once="true"
						>
							<div className="grid items-center gap-[30px] lg:gap-[0] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
								<div>
									<Image src={process3} alt="process" />
								</div>

								<div className="text-[#00000078] space-y-[15px] lg:pl-[30px] rtl:lg:pl-0 rtl:lg:pr-[30px] max-w-[496px]">
									<h3 className="text-white text-[22px] md:text-[25px] lg:text-[30px] leading-[1.1]">
										<span className="text-[#00000078]">
											03.
										</span>{" "}
										<span className="text-[#FCA120]">
											Happy
										</span>{" "}
										Problem solved
									</h3>

									<p className="text-[15px]">
										Learn about how them you went down
										prying the wedding to ring off his cold,
										dead finger. I don’t know what you did,
										Fry, but once again.
									</p>

									<p className="text-[15px]">
										You screwed up! Now all the planets are
										gonna start cracking wise about our
										mamas.
									</p>
								</div>
							</div>
						</div>

						{/* Shape Images */}
						<Image
							src={shape6}
							alt="shape6"
							className="absolute xl:top-[241px] xl:left-[56px] xl:max-w-[632px] 2xl:top-[274px] 2xl:left-[67px] 2xl:max-w-[696px] z-0 hidden xl:block rtl:hidden"
							data-aos="fade-in"
							data-aos-delay="100"
							data-aos-duration="800"
							data-aos-once="true"
						/>
						<Image
							src={shape7}
							alt="shape7"
							className="absolute xl:top-[735px] xl:right-[12px] xl:max-w-[660px] 2xl:top-[814px] 2xl:right-[12px] 2xl:max-w-[750px] hidden xl:block rtl:hidden"
							data-aos="fade-in"
							data-aos-delay="200"
							data-aos-duration="800"
							data-aos-once="true"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default WorkingProcess;
