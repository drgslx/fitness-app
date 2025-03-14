"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import logo from "/public/images/logo.png";
import Profile from "./Profile";
import { menuData } from "@/libs/menuData";

const Navbar = ({ currentUser, isAdmin, isUser }) => {
	const currentRoute = usePathname();
	const { lang } = useParams();
	const { count } = useCartStore();

	// Sticky Navbar
	useEffect(() => {
		const handleScroll = () => {
			const elementId = document.getElementById("navbar");
			if (window.scrollY > 150) {
				elementId?.classList.add("isSticky");
			} else {
				elementId?.classList.remove("isSticky");
			}
		};

		document.addEventListener("scroll", handleScroll);

		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Toggle mobile menu
	const [isActive, setActive] = useState(false);
	const handleToggleMenu = () => setActive(!isActive);
	
	// Close menu handler
	const closeMenu = () => setActive(false);

	return (
		<>
			<div
				id="navbar"
				className="navbar-area flex  bg-black relative z-[2] py-[20px] lg:py-[25px] xl:py-0 px-2 sm:px-2 lg:px-6 xl:px-12 2xl:px-20"
			>
				<div className="container mx-auto ">
					<nav className={`navbar relative flex flex-wrap ${isActive ? "active" : ""}`}>
						<div className="self-center text-[24px]">
							<Link href={`/${lang}`} onClick={closeMenu}>
								<h1 className="text-white transition duration-500 ease-in-out hover:text-[#f13a11]">
									Ultimate Arena Fighting Club
								</h1>
							</Link>
						</div>

						{/* Toggle button */}
						<button
							className="navbar-toggler absolute ml-auto right-0 rtl:right-auto rtl:left-0 top-[2px] xl:hidden"
							type="button"
							onClick={handleToggleMenu}
						>
							<span className="burger-menu text-white cursor-pointer leading-none text-[30px]">
								<i className="ri-menu-line"></i>
							</span>
						</button>

						<div className="navbar-collapse flex self-center grow basis-auto">
							<ul className="navbar-nav self-center flex-row mx-auto xl:flex">
								{menuData.map((item, index) => (
									<li
										key={index}
										className="xl:mx-[10px] 2xl:mx-[18px] py-[10px] lg:py-[15px] xl:py-[35px] 2xl:py-[38px] relative group last:mr-0 first:ml-0"
									>
										<Link
											href={`/${lang}${item.link}`}
											className="transition duration-500 ease-in-out text-white text-[16px] font-medium hover:text-[#f13a11]"
											onClick={closeMenu} // Close menu on click
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>

							

							{(isAdmin || isUser) ? <div className="flex items-center other-options self-center border border-[#fff] py-[5px] xl:py-[12px] px-[15px] xl:px-[20px] space-x-[15px] xl:space-x-[20px] rtl:space-x-reverse absolute xl:relative top-0 right-[50px] rtl:right-auto rtl:left-[40px] xl:right-[0] rtl:xl:right-auto rtl:xl:left-[0]">
								{/* Profile */}
								{currentUser ? (
									<Profile user={currentUser} />
								) : (
									<Link
										href="/login/"
										className="user text-[16px] xl:text-[22px] text-white"
										onClick={closeMenu} // Close menu on click
									>
										<i className="ri-user-line"></i>
									</Link>
								)}

								{/* Cart Link */}
								{/* <Link
									href={`/${lang}/cart`}
									className="relative text-white text-[16px] xl:text-[22px] inline-block"
									onClick={closeMenu} // Close menu on click
								>
									<i className="ri-shopping-bag-line"></i>
									<span className="bg-[#051F0D] text-white text-[10px] w-[18px] h-[18px] leading-[18px] inline-block text-center rounded-full absolute top-[-5px] xl:top-[-3px] right-[-10px] xl:right-[-8px]">
										{count()}
									</span>
								</Link> */}
							</div>: null}

						</div>
					</nav>
				</div>
			</div>
		</>
	);
};

export default Navbar;
