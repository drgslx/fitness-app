"use client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Pagination = ({ totalPages }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const searchParams = useSearchParams();
	const page = searchParams.get("page");
	const router = useRouter();
	const { lang } = useParams();

	useEffect(() => {
		setCurrentPage(page ? parseInt(page) : 1);
	}, [page]);

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

	return (
		<nav aria-label="Page navigation example">
			<ul className="space-x-[5px] rtl:space-x-reverse text-center xl:text-end rtl:xl:text-right mt-[30px] md:mt-[45px]">
				<li className="inline-block">
					<button
						onClick={() =>
							router.push(
								`/${lang}/courses?page=${currentPage - 1}`
							)
						}
						className={`flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff] ${
							currentPage <= 1
								? "cursor-not-allowed"
								: "cursor-pointer"
						}`}
						disabled={currentPage <= 1}
					>
						<i className="ri-arrow-left-line"></i>
					</button>
				</li>

				{/* Render page numbers */}
				{pages.map((pageNumber) => {
					return (
						<li key={pageNumber} className="inline-block">
							<a
								href={`/${lang}/courses?page=${pageNumber}`} // Update URL with page number
								className={`flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff] ${
									currentPage === pageNumber
										? "bg-[#1151f2] text-[#fff]"
										: ""
								}`}
							>
								{pageNumber}
							</a>
						</li>
					);
				})}

				<li className="inline-block">
					<button
						onClick={() =>
							router.push(
								`/${lang}/courses?page=${currentPage + 1}`
							)
						}
						className={`flex items-center justify-center border border-[#1151f2] h-[36px] w-[55px] leading-tight rounded-[30px] font-semibold text-[##051F0D] hover:bg-[#1151f2] hover:border-[#1151f2] hover:text-[#fff] ${
							currentPage >= totalPages
								? "cursor-not-allowed"
								: "cursor-pointer"
						}`}
						disabled={currentPage >= totalPages}
					>
						<i className="ri-arrow-right-line"></i>
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
