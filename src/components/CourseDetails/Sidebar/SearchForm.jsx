"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchForm = () => {
	const [search, setSearch] = useState("");
	const router = useRouter();
	const { lang } = useParams();

	const handleSearch = (e) => {
		e.preventDefault();
		router.push(`/${lang}/courses?q=${search}`);
	};
	return (
		<>
			<div >
				<h3 className="text-[#fff]  font-bold text-[22px] leading-none mb-[15px]">
					Search
				</h3>
				<form onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="Search your course"
						className="bg-transparent text-[#ffffff] border border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#ffffff]"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</form>
			</div>
		</>
	);
};

export default SearchForm;
