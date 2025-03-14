import React from "react";
import AdminSidebar from "../AdminSidebar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import TopNav from "./TopNav";
import Content from "./Content";
import { getCategories } from "@/actions/admin/getCategories";
import { getEvents } from "@/actions/admin/getEvents";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	redirectIfNotAdmin(currentUser, params);
	const { events } = await getEvents();
	return (
		<div className="bg-black py-[24px] ">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px] ">
						<TopNav />
						<Content events={events} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
