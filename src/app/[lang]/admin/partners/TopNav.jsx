"use client";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const TopNav = () => {
	const { lang } = useParams();
	const pathname = usePathname();
	return (
		<ul className="flex space-x-[15px] border-b">
			<li>
				<Link
					className={`${
						pathname === `/${lang}/admin/partners` &&
						"text-blue-600 font-medium"
					}`}
					href={`/${lang}/admin/partners`}
				>
					Partners
				</Link>
			</li>
			<li>
				<Link
					className={`${
						pathname === `/${lang}/admin/partners/create` &&
						"text-blue-600 font-medium"
					}`}
					href={`/${lang}/admin/partners/create`}
				>
					Create
				</Link>
			</li>
		</ul>
	);
};

export default TopNav;
