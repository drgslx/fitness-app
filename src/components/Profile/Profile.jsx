"use client";

import React from "react";
import Nav from "./Nav";
import Image from "next/image";

import studentProfile from "/public/images/student-profile.jpg";
import Bio from "./Bio";

const Profile = ({ currentUser }) => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto lg:max-w-[1150px]">
					{/* Nav */}
					<Nav />

					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<div>
							<Image
								src={
									currentUser.image
										? currentUser.image
										: studentProfile
								}
								alt="student"
								className="mb-[25px]"
								width={600}
								height={600}
							/>

							<h3 className="text-[25px] leading-none mb-[5px]">
								{currentUser.name}
							</h3>

							<p className="text-[15px]">
								Role: {currentUser.role}
							</p>

							{currentUser.profile && (
								<ul className="mt-[15px] space-x-[10px] rtl:space-x-reverse">
									{currentUser.profile.linkedin && (
										<li className="inline-block">
											<a
												href={
													currentUser.profile.linkedin
												}
												target="_black"
												className="bg-[#fff] border border-[#E5FFEF] text-[#000000] w-[40px] h-[40px] leading-[36px] inline-block rounded-full text-center transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-white"
											>
												<i className="ri-linkedin-line"></i>
											</a>
										</li>
									)}

									{currentUser.profile.twitter && (
										<li className="inline-block">
											<a
												href={
													currentUser.profile.twitter
												}
												target="_black"
												className="bg-[#fff] border border-[#E5FFEF] text-[#000000] w-[40px] h-[40px] leading-[36px] inline-block rounded-full text-center transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-white"
											>
												<i className="ri-twitter-line"></i>
											</a>
										</li>
									)}

									{currentUser.profile.facebook && (
										<li className="inline-block">
											<a
												href={
													currentUser.profile.facebook
												}
												target="_black"
												className="bg-[#fff] border border-[#E5FFEF] text-[#000000] w-[40px] h-[40px] leading-[36px] inline-block rounded-full text-center transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-white"
											>
												<i className="ri-facebook-line"></i>
											</a>
										</li>
									)}

									{currentUser.profile.youtube && (
										<li className="inline-block">
											<a
												href={
													currentUser.profile.youtube
												}
												target="_black"
												className="bg-[#fff] border border-[#E5FFEF] text-[#000000] w-[40px] h-[40px] leading-[36px] inline-block rounded-full text-center transition duration-500 ease-in-out hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-white"
											>
												<i className="ri-youtube-line"></i>
											</a>
										</li>
									)}
								</ul>
							)}
						</div>

						<Bio {...currentUser} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
