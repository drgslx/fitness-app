import React from "react";
import AdminSidebar from "../AdminSidebar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirectIfNotAdmin } from "@/utils/admin";

const page = async ({
	students = 0,
	instructors = 0,
	courses = 0,
	enrolments = 0,
	earningsTotal = 0,
	videos = 0,
	assets = 0,
	user = 0,
	params,
}) => {
	const currentUser = await getCurrentUser();
	redirectIfNotAdmin(currentUser, params);
	return (
		<div className="bg-black py-[50px]">
			<div className="container mx-auto">
				<div className="grid gap-[20px] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
					<AdminSidebar />
					<div className="lg:col-span-3 space-y-[30px]">
						<div className="flex-1 flex flex-col">
							<div className="flex-1 lg:p-10">
								<div className="grid md:grid-cols-3 gap-6">
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px] font-semibold text-gray-800">
											Users
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{user}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Courses
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{courses}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Assets
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{assets}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Videos
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{videos}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Students
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{students}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Instructors
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{instructors}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Enrolments
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{enrolments}
										</div>
									</div>
									<div className="bg-white p-6 rounded-lg shadow-md">
										<div className="text-[20px]  font-semibold text-gray-800">
											Earnings Total
										</div>
										<div className="text-gray-500 mt-2 text-lg">
											{earningsTotal}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
