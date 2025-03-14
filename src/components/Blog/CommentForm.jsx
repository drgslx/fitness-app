"use client";

import React from "react";

const CommentForm = () => {
	return (
		<>
			<div className="lg:pt-[30px]">
				<h3 className="text-[#000000] font-bold text-[20px] md:text-[22px] lg:text-[25px] leading-none mb-[15px]">
					Leave a reply
				</h3>
				<form className="space-y-[25px]">
					<div className="grid gap-[25px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
						<div>
							<input
								type="email"
								placeholder="La tua email"
								className="bg-transparent text-[#ffffff] border border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#ffffff]"
							/>
						</div>

						<div>
							<input
								type="text"
								placeholder="Your name"
								className="bg-transparent text-[#ffffff] border border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#ffffff]"
							/>
						</div>
					</div>

					<div>
						<textarea
							placeholder="Your comment..."
							rows={5}
							className="bg-transparent text-[#ffffff] border border-[#1151f2] block w-full py-[10px] px-[25px] focus:outline-none placeholder-[#ffffff]"
						/>
					</div>

					<div>
						<button
							type="submit"
							className="bg-[#1151f2] text-[#fff] text-[16px] font-semibold block w-full py-[15px] sm:py-[17px] px-[21px] sm:px-[30px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
						>
							Leave A Comment{" "}
							<i className="ri-arrow-right-up-line"></i>
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default CommentForm;
