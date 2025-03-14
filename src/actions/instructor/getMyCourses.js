import { getCurrentUser } from "../getCurrentUser";
import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";

export async function getMyCourses() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const courses = await prisma.course.findMany({
			where: { userId: currentUser.id },
			include: {
				user: {
					select: {
						name: true,
						image: true,
					},
				},
				reviews: true,
				category: {
					select: {
						name: true,
					},
				},
			},
		});

		// console.log(courses);

		return { courses };
	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}
