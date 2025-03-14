import { getCurrentUser } from "../getCurrentUser";
import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";

export async function getSingleCourse(courseId) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const course = await prisma.course.findUnique({
			where: { id: parseInt(courseId) },
		});
		const course_videos = await prisma.video.findMany({
			where: { courseId: parseInt(courseId) },
			orderBy: { short_id: "asc" },
		});
		const course_assets = await prisma.asset.findMany({
			where: { courseId: parseInt(courseId) },
		});

		return { course, course_videos, course_assets };
	} catch (error) {
		console.error("Error fetching courses:", error);
	}
}
