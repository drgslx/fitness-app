"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Image from "next/image";

import eventImg1 from "/public/images/event-img4.jpg";

const CourseDetailsContent = () => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<div className="space-y-[30px]">
								<div className="details-content space-y-[20px]">
									<div className="mb-[30px]">
										<Image src={eventImg1} alt="event" />
									</div>
									<h1>
										How meditation improve your mental
										health in winter season this is
										interesting.
									</h1>

									<p>
										Our online courses cover a wide range of
										topics, from personal development and
										wellness to professional skills like
										leadership, communication, and for the
										entrepreneurship Our online courses
										cover a wide range of topics, from
										person and wellness to professional
										skills like leadership.
									</p>

									<p>
										The goal of this course is to take you,
										you beautiful front end developer you,
										from someone with very little or no
										jQuery or JavaScript knowledge and up
										you to someone who is quite comfortable.
									</p>

									<p>
										Lorem ipsum dolor sit amet, consectetur
										adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris
										nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit
										in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint
										occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt.
									</p>

									<p>
										Sed ut perspiciatis unde omnis iste
										natus error sit voluptatem accusantium
										doloremque laudantium, totam rem
										aperiam, eaque ipsa quae ab illo
										inventore veritatis et quasi architecto
										beatae vitae dicta sunt explicabo. Nemo
										enim ipsam voluptatem quia voluptas sit
										aspernatur aut odit aut fugit, sed quia
										consequuntur magni dolores eos qui
										ratione voluptatem sequi nesciunt.
									</p>
								</div>

								<div className="sm:flex items-center justify-between space-y-[20px] sm:space-y-[0]">
									<div>
										<button
											type="submit"
											className="bg-#f13a11 text-[#fff] text-[16px] font-semibold inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[35px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
										>
											Buy Ticket Now{" "}
											<i className="ri-arrow-right-up-line"></i>
										</button>
									</div>

									<div className="flex items-center space-x-[10px] rtl:space-x-reverse">
										<p className="text-[#000000] text-[16px] lg:text-[20px]">
											Share On:
										</p>

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
													href="https://www.twitter.com/"
													target="_black"
													className="bg-[#051F0D1A] text-[#051F0D] inline-block w-[32px] h-[32px] leading-[32px] text-center rounded-full transition duration-500 ease-in-out hover:bg-[#051F0D] hover:text-[#fff]"
												>
													<i className="ri-twitter-fill"></i>
												</a>
											</li>

											<li className="inline-block">
												<a
													href="https://www.linkedin.com/"
													target="_black"
													className="bg-[#051F0D1A] text-[#051F0D] inline-block w-[32px] h-[32px] leading-[32px] text-center rounded-full transition duration-500 ease-in-out hover:bg-[#051F0D] hover:text-[#fff]"
												>
													<i className="ri-linkedin-fill"></i>
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
									</div>
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div>
							<Sidebar />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseDetailsContent;
