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
						pathname === `/${lang}/admin/courses` &&
						"text-blue-600 font-medium"
					}`}
					href={`/${lang}/admin/courses`}
				>
					Courses
				</Link>
			</li>
			<li>
				<Link
					className={`${
						pathname === `/${lang}/admin/courses/new-arrival` &&
						"text-blue-600 font-medium"
					}`}
					href={`/${lang}/admin/courses/new-arrival`}
				>
					New Arrival
				</Link>
			</li>
		</ul>
	);
};

export default TopNav;
