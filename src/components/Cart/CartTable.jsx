"use client";

import React from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/store/cart";
import { cartAmoutSub, cartTotal } from "@/utils/cartTotal";
import { useParams } from "next/navigation";
import CheckoutList from "./CheckoutList";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const CartTable = () => {
	const { lang } = useParams();
	const { count, cart, remove } = useCartStore();
	const handleRemove = async (cartId) => {
		remove(cartId);
	};
	return (
		<>
			<div className="py-[50px] md:py-[60px] lg:py-[140px]">
				<div className="container mx-auto">
					<div className="relative overflow-x-auto">
						<table className="w-[850px] lg:w-full text-left rtl:text-right">
							<thead className="text-[14px] md:text-[16px] text-[#051F0D] bg-white">
								<tr>
									<th scope="col" className="px-6 py-5">
										Product
									</th>
									<th
										scope="col"
										className="px-6 py-5 text-center"
									>
										Actual Price
									</th>

									<th
										scope="col"
										className="px-6 py-5 text-center"
									>
										Regular Price
									</th>
									<th
										scope="col"
										className="px-6 py-5 text-end"
									>
										Remove
									</th>
								</tr>
							</thead>

							<tbody>
								{count() > 0 &&
									cart.map((crt, index) => (
										<CheckoutList
											key={index}
											{...crt}
											onRemove={() =>
												handleRemove(crt.id)
											}
										/>
									))}
							</tbody>
						</table>
					</div>

					{/* Cart Totals */}
					<div className="bg-white p-[30px] lg:p-[50px] max-w-[530px] ml-auto mt-[50px] lg:mt-[80px]">
						<ul className="space-y-[20px]">
							<li className="flex items-center justify-between border-b border-[#1151f2] pb-[25px] mb-[25px] last:border-none last:pb-[0] last:mb-[0]">
								<h3 className="text-[#000000] text-[20px] lg:text-[22px] leading-none">
									Cart Totals
								</h3>
								<h3 className="text-[#000000] text-[20px] lg:text-[22px] leading-none">
									${cartTotal(cart)}
								</h3>
							</li>
						</ul>

						<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

						<Elements stripe={stripePromise}>
							<PaymentForm />
						</Elements>
					</div>
				</div>
			</div>
		</>
	);
};

export default CartTable;
