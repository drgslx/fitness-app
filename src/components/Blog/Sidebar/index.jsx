"use client";

import React from "react";
import SearchForm from "./SearchForm";
import PopularNews from "./PopularNews";
import Categories from "./Categories";
import Tags from "./Tags";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Sidebar = () => {
	return (
		<>
			<div className="bg-white py-[30px] md:py-[45px] lg:py-[30px] xl:py-[45px] px-[20px] md:px-[35px] lg:px-[20px] xl:px-[35px] space-y-[30px] md:space-y-[45px]">
				{/* SearchForm */}
				<SearchForm />

				{/* PopularNews */}
				<PopularNews />

				{/* Categories */}
				<Categories />

				{/* Tags */}
				<Tags />
			</div>
		</>
	);
};

export default Sidebar;
