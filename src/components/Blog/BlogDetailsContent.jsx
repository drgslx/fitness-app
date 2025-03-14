"use client";

import React from "react";
import Link from "next/link";
import PromoVideo from "./PromoVideo";
import Sidebar from "./../Blog/Sidebar";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import Image from "next/image";

import blogImg1 from "/public/images/blog-img4.jpg";

const BlogDetailsContent = () => {
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="grid gap-[30px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
						<div className="lg:col-span-2 space-y-[30px]">
							<div className="border-b border-[#1151f2] pb-[30px]">
								<h3 className="text-[20px] md:text-[30px] lg:text-[32px] xl:text-[42px] mb-[15px] leading-[1.2]">
									How meditation improve your mental health in
									winter season this is interesting.
								</h3>

								<ul className="flex items-center space-x-[15px] sm:space-x-[20px] rtl:space-x-reverse">
									<li className="text-[13px] sm:text-[15px] flex items-center">
										<i className="ri-user-line text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										<Link
											href="#"
											className="hover:text-[#1151f2]"
										>
											William Smith
										</Link>
									</li>
									<li className="text-[13px] sm:text-[15px] flex items-center">
										<i className="ri-calendar-2-line text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										08 April 2023
									</li>
									<li className="text-[13px] sm:text-[16px] flex items-center">
										<i className="ri-time-line text-[#1151f2] text-[17px] mr-2 rtl:mr-0 rtl:ml-2"></i>{" "}
										03 Min Read
									</li>
								</ul>
							</div>

							{/* Details Content */}
							<div className="details-content space-y-[20px]">
								<p>
									Our online courses cover a wide range of
									topics, from personal development and
									wellness to professional skills like
									leadership, communication, and for the
									entrepreneurship Our online courses cover a
									wide range of topics, from person and
									wellness to professional skills like
									leadership.
								</p>

								<Image src={blogImg1} alt="blog" />

								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip
									ex ea commodo consequat.
								</p>

								<p>
									Sed ut perspiciatis unde omnis iste natus
									error sit voluptatem accusantium doloremque
									laudantium, totam rem aperiam, eaque ipsa
									quae ab illo inventore veritatis et quasi
									architecto beatae vitae dicta sunt
									explicabo.
								</p>

								<p>
									But I must explain to you how all this
									mistaken idea of denouncing pleasure and
									praising pain was born and I will give you a
									complete account of the system, and expound
									the actual teachings of the great explorer
									of the truth, the master-builder of human
									happiness.
								</p>

								<ul>
									<li>
										Development and wellness to professional{" "}
									</li>
									<li>Personal development and wellness</li>
									<li>
										Our online courses cover a wide range of
										topics
									</li>
									<li>
										professional skills like leadership.
									</li>
								</ul>

								<h5>Professional skills like leadership</h5>

								<p>
									At vero eos et accusamus et iusto odio
									dignissimos ducimus qui blanditiis
									praesentium voluptatum deleniti atque
									corrupti quos dolores et quas molestias
									excepturi sint occaecati cupiditate non
									provident, similique sunt in culpa qui
									officia deserunt mollitia animi, id est
									laborum et dolorum fuga.
								</p>

								<p>
									On the other hand, we denounce with
									righteous indignation and dislike men who
									are so beguiled and demoralized by the
									charms of pleasure of the moment, so blinded
									by desire, that they cannot foresee the pain
									and trouble that are bound to ensue; and
									equal blame belongs to those who fail in
									their duty through weakness of will, which
									is the same as saying through shrinking from
									toil and pain.
								</p>

								<blockquote>
									“Our online courses cover a wide range of,
									from personal development wellness to
									professional skills like leadership,
									communication, and for the
									entrepreneurship.”
								</blockquote>

								{/* PromoVideo */}
								<div className="py-[15px]">
									<PromoVideo />
								</div>
							</div>

							{/* Tags & Social share */}
							<div className="sm:flex items-center justify-between space-y-[20px] sm:space-y-[0]">
								<div className="flex items-center space-x-[10px] rtl:space-x-reverse">
									<p className="text-[#000000] text-[16px] font-semibold">
										Tags:
									</p>

									<ul className="space-x-[10px] rtl:space-x-reverse">
										<li className="inline-block">
											<Link
												href="#"
												className="text-[13px] inline-block border border-[#1151f2] py-[10px] px-[20px] leading-none rounded-[30px] hover:bg-[#1151f2] hover:text-[#fff] hover:border-[#1151f2]"
											>
												Digital
											</Link>
										</li>
										<li className="inline-block">
											<Link
												href="#"
												className="text-[13px] inline-block border border-[#1151f2] py-[10px] px-[20px] leading-none rounded-[30px] hover:bg-[#1151f2] hover:text-[#fff] hover:border-[#1151f2]"
											>
												Data
											</Link>
										</li>
									</ul>
								</div>

								<div className="flex items-center space-x-[10px] rtl:space-x-reverse">
									<p className="text-[#000000] text-[16px] font-semibold">
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

							{/* CommentList */}
							<CommentList />

							{/* CommentForm */}
							<CommentForm />
						</div>

						<div>
							{/* Sidebar */}
							<Sidebar />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogDetailsContent;
