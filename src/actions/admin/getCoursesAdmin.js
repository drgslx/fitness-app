import { getCurrentUser } from "../getCurrentUser";
import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";

export async function getCoursesAdmin() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const courses = await prisma.course.findMany({
			where: { approved: true },
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				videos: {
					select: {
						id: true,
					},
				},
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
			},
		});

		return { courses };
	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}

export async function getNewCourses() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const courses = await prisma.course.findMany({
			where: { approved: false },
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				videos: {
					select: {
						id: true,
					},
				},
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
			},
		});

		return { courses };
	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}
