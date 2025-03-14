"use client";

import React from "react";
import { useCartStore } from "@/store/cart";

const AddToCartButton = ({
	id,
	title,
	slug,
	regular_price,
	before_price,
	duration,
	lessons,
	access_time,
	image,
	user,
}) => {
	const { add: handleAddToCart, cart } = useCartStore();

	const item = {
		id,
		title,
		slug,
		regular_price,
		before_price,
		duration,
		lessons,
		access_time,
		image,
		user,
	};
	return (
		<div>
			{cart.map((item) => item.id).includes(id) ? (
				<button
					className="bg-#f13a11 text-[#fff] text-[16px] font-semibold inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[35px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
					disabled={true}
				>
					Add to cart <i className="ri-shopping-cart-line"></i>
				</button>
			) : (
				<button
					className="bg-#f13a11 text-[#fff] text-[16px] font-semibold inline-block py-[15px] sm:py-[17px] px-[21px] sm:px-[35px] leading-none border border-[#1151f2] transition duration-500 ease-in-out hover:bg-black hover:border-[#000] hover:text-[#fff]"
					onClick={() => handleAddToCart(item)}
				>
					Add to cart <i className="ri-shopping-cart-line"></i>
				</button>
			)}
		</div>
	);
};

export default AddToCartButton;
