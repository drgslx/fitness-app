"use client";

import React from "react";

const SearchForm = () => {
	return (
		<>
			<div>
				<h3 className="text-[#000000] font-bold text-[22px] leading-none mb-[15px]">
					Search
				</h3>
				<form>
					<input
						type="text"
						placeholder="Search your course"
						className="bg-transparent text-[#000] border border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#ffffff]"
					/>
				</form>
			</div>
		</>
	);
};

export default SearchForm;
