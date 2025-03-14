import React from "react";
import AdminSidebar from "../AdminSidebar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import TopNav from "./TopNav";
import { getUsers } from "@/actions/admin/getUser";
import StudentsTable from "./StudentsTable";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	redirectIfNotAdmin(currentUser, params);
	const { users } = await getUsers();
	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px]">
						<TopNav />
						<StudentsTable users={users} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
