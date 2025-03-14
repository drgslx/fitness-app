import React from "react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import TopNav from "../TopNav";
import AdminSidebar from "../../AdminSidebar";
import { getInstructorsById } from "@/actions/admin/getInstructors";
import UpdateForm from "./UpdateForm";
import { getCategories } from "@/actions/admin/getCategories";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	redirectIfNotAdmin(currentUser, params);
	const { instructor } = await getInstructorsById(params);
	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px]">
						<TopNav />
						<UpdateForm instructor={instructor} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
