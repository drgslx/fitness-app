import React from "react";
import AdminSidebar from "../AdminSidebar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";
import { getCoursesAdmin } from "@/actions/admin/getCoursesAdmin";
import CoursesTable from "./CoursesTable";
import TopNav from "./TopNav";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	const { courses } = await getCoursesAdmin();
	redirectIfNotAdmin(currentUser, params);
	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px]">
						<TopNav />
						<CoursesTable courses={courses} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
