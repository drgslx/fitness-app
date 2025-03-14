import React from "react";
import AdminSidebar from "../AdminSidebar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import TopNav from "./TopNav";
import { getCategories } from "@/actions/admin/getCategories";
import Content from "./Content";
export const dynamic = "force-dynamic";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	redirectIfNotAdmin(currentUser, params);
	const { categories } = await getCategories();
	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px] px-[50px]">
						<TopNav />
						<Content categories={categories} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
