import { getCurrentUser } from "./getCurrentUser";
import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";

export async function myLearnings() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const enrolments = await prisma.enrolment.findMany({
			where: { userId: currentUser.id },
			include: {
				course: {
					include: {
						user: true,
						reviews: true,
						category: true,
					},
				},
			},
		});

		return { enrolments };
	} catch (error) {
		console.error("Error fetching counts:", error);
	}
}

export async function myLearningPlay(params) {
	const { courseId } = params;
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const course = await prisma.course.findUnique({
			where: { id: parseInt(courseId) },

			include: {
				videos: {
					orderBy: { short_id: "asc" },
				},
				reviews: {
					orderBy: { id: "desc" },
					include: {
						user: {
							select: {
								name: true,
								image: true,
							},
						},
					},
				},
			},
		});

		return { course };
	} catch (error) {
		console.error("Error fetching counts:", error);
	}
}
export async function courseCertificate(params) {
	const { courseId } = params;
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const course = await prisma.course.findUnique({
			where: { id: parseInt(courseId) },
		});

		return { course };
	} catch (error) {
		console.error("Error fetching counts:", error);
	}
}
