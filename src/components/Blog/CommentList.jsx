"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import user1 from "/public/images/user1.png";
import user2 from "/public/images/user2.png";
import user3 from "/public/images/user3.png";

const CommentList = () => {
	return (
		<>
			<div className="lg:pt-[30px]">
				<h2 className="text-[#fff] font-bold text-[20px] md:text-[22px] lg:text-[25px] xl:text-[30px] mb-[20px] md:mb-[30px] leading-none">
					Comments
				</h2>
				<ul className="space-y-[20px] md:space-y-[30px]">
					<li className="border border-[#1151f2] p-[20px] md:p-[30px]">
						<div className="space-y-[15px] border-b border-[#1151f2] pb-[25px]">
							<div className="flex items-center justify-between space-x-[10px] rtl:space-x-reverse">
								<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
									<Image
										src={user1}
										className="w-[60px] h-[60px] rounded-full"
										alt="user"
									/>
									<div>
										<h4 className="text-[#000000] font-bold text-[16px] md:text-[20px] leading-none">
											Jonathon Ronan
										</h4>
										<p className="text-[13px]">
											12 Days ago
										</p>
									</div>
								</div>

								<Link
									href="#"
									className="border border-[#1151f2] py-[6px] px-[13px] leading-none inline-block rounded-full ease-in duration-300 text-[14px] hover:bg-[#1151f2] hover:text-[#fff] hover:border-[#1151f2]"
								>
									Reply
								</Link>
							</div>

							<p className="text-[15px]">
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Viverra elementum tellus odio
								at enim arcu eget tristique sed. Tellus tellus
								ac orci id est faucibus mattis ultrices gravida.
							</p>
						</div>

						<ul className="mt-[20px] md:mt-[30px] space-y-[20px] md:space-y-[30px]">
							<li className="md:pl-[50px]">
								<div className="space-y-[15px]">
									<div className="flex items-center justify-between space-x-[10px] rtl:space-x-reverse">
										<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
											<Image
												src={user2}
												className="w-[60px] h-[60px] rounded-full"
												alt="user"
											/>
											<div>
												<h4 className="text-[#000000] font-bold text-[16px] md:text-[20px] leading-none">
													Jonson Jems
												</h4>
												<p className="text-[13px]">
													12 Days ago
												</p>
											</div>
										</div>

										<Link
											href="#"
											className="border border-[#1151f2] py-[6px] px-[13px] leading-none inline-block rounded-full ease-in duration-300 text-[14px] hover:bg-[#1151f2] hover:text-[#fff] hover:border-[#1151f2]"
										>
											Reply
										</Link>
									</div>

									<p className="text-[15px]">
										Lorem ipsum dolor sit amet, consectetur
										adipiscing elit. Viverra elementum
										tellus odio at enim arcu eget tristique
										sed. Tellus tellus ac orci id est
										faucibus mattis ultrices gravida.
									</p>
								</div>
							</li>
						</ul>
					</li>

					<li className="border border-[#1151f2] p-[20px] md:p-[30px]">
						<div className="space-y-[15px]">
							<div className="flex items-center justify-between space-x-[10px] rtl:space-x-reverse">
								<div className="flex items-center space-x-[15px] rtl:space-x-reverse">
									<Image
										src={user3}
										className="w-[60px] h-[60px] rounded-full"
										alt="user"
									/>
									<div>
										<h4 className="text-[#000000] font-bold text-[16px] md:text-[20px] leading-none">
											Wiilam Cambel
										</h4>
										<p className="text-[13px]">
											12 Days ago
										</p>
									</div>
								</div>

								<Link
									href="#"
									className="border border-[#1151f2] py-[6px] px-[13px] leading-none inline-block rounded-full ease-in duration-300 text-[14px] hover:bg-[#1151f2] hover:text-[#fff] hover:border-[#1151f2]"
								>
									Reply
								</Link>
							</div>

							<p className="text-[15px]">
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Viverra elementum tellus odio
								at enim arcu eget tristique sed. Tellus tellus
								ac orci id est faucibus mattis ultrices gravida.
							</p>
						</div>
					</li>
				</ul>
			</div>
		</>
	);
};

export default CommentList;
