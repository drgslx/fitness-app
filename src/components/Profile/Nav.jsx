"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Nav = () => {
	const currentRoute = usePathname();
	const { lang } = useParams();

	return (
		<>
			<ul className="border-b border-[#D2EFDC] pb-[5px] mb-[30px] space-x-[30px] lg:space-x-[50px] rtl:space-x-reverse">
				<li className="inline-block">
					<Link
						href={`/${lang}/profile/info/`}
						className={`inline-block font-medium text-[18px] text-white transition-all hover:text-[#1151f2] ${
							currentRoute === `/${lang}/profile/info`
								? "text-[#1151f2]"
								: "text-[#000000]"
						}`}
					>
						My Profile
					</Link>
				</li>

				<li className="inline-block">
					<Link
						href={`/${lang}/profile/settings`}
						className={`inline-block font-medium text-[18px] transition-all  text-white hover:text-[#1151f2] ${
							currentRoute === `/${lang}/profile/settings`
								? "text-[#1151f2]"
								: "text-[#000000]"
						}`}
					>
						Settings
					</Link>
				</li>

				{/* <li className="inline-block">
					<Link
						href={`/${lang}/profile/my-learnings`}
						className={`inline-block font-medium text-[18px] transition-all  text-white hover:text-[#1151f2] ${
							currentRoute === `/${lang}/profile/my-learnings`
								? "text-[#1151f2]"
								: "text-[#000000]"
						}`}
					>
						My Learnings
					</Link>
				</li>

				<li className="inline-block">
					<Link
						href={`/${lang}/profile/my-favorites`}
						className={`inline-block font-medium text-[18px] transition-all  text-white hover:text-[#1151f2] ${
							currentRoute === `/${lang}/profile/my-favorites`
								? "text-[#1151f2]"
								: "text-[#000000]"
						}`}
					>
						My Favorites
					</Link>
				</li> */}
			</ul>
		</>
	);
};

export default Nav;
