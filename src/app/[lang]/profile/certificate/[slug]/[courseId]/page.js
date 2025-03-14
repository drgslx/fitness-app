import { getCurrentUser } from "@/actions/getCurrentUser";
import { courseCertificate } from "@/actions/myLearnings";
import React from "react";
import Content from "../../Content";

const page = async ({ params }) => {
	const currentUser = await getCurrentUser();
	const { course } = await courseCertificate(params);

	return (
		<div className="bg-black py-[50px]">
			<Content currentUser={currentUser} {...course} />
		</div>
	);
};

export default page;
