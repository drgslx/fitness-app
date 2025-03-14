"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const AdminSidebar = () => {
	const { lang } = useParams();
	const pathname = usePathname();
	return (
		<div className="flex-shrink-0 w-full bg-black shadow-md">
			<div className="flex flex-col h-full">
				<div className="h-16 bg-[#1151f2] flex items-center justify-center">
					<span className="text-white font-semibold text-lg">
						Site Admin
					</span>
				</div>
				<div className="flex-1 overflow-y-auto">
					<ul className="py-4">
						{/* <li className="pl-4 mb-1">
							<Link
							href={`/${lang}/admin/dashboard`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/dashboard` &&
									"bg-[#1151f2] text-white italic"
								}`}
								>
								<i className="ri-dashboard-fill"></i> Dashboard
								</Link>
						</li> */}
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/students`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/students` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-user-smile-fill"></i> Users
							</Link>
						</li>
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/instructors`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/instructors` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-dashboard-fill"></i> Instructors
							</Link>
						</li>
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/categories`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/categories` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-map-2-fill"></i> Disciplines
							</Link>
						</li>
						{/* <li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/partners`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/partners` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-image-fill"></i> Partners
							</Link>
						</li> */}
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/gallery`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/gallery` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-image-fill"></i> Gallery
							</Link>
						</li>
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/events`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname === `/${lang}/admin/events` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-image-fill"></i> Events
							</Link>
						</li>
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/testimonials`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname ===
										`/${lang}/admin/testimonials` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-feedback-fill"></i>{" "}
								Reviews
							</Link>
						</li>
						<li className="pl-4 mb-1">
							<Link
								href={`/${lang}/admin/announcements`}
								className={`block p-2 hover:bg-[#1151f2] hover:text-white ${
									pathname ===
										`/${lang}/admin/announcements` &&
									"bg-[#1151f2] text-white italic"
								}`}
							>
								<i className="ri-feedback-fill"></i>{" "}
								Announcements
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default AdminSidebar;
