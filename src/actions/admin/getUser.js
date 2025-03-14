import { getCurrentUser } from "../getCurrentUser";
import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";

export async function getUsers() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const users = await prisma.user.findMany({
			include: {
				profile: true,
			},
		});

		return { users };
	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}
