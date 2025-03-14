import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request, { params }) {
	const { courseId } = params;

	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return NextResponse.json(
				{
					message: "Unauthorized user.",
				},
				{ status: 401 }
			);
		}
		const body = await request.json();

		const { apply } = body;

		await prisma.course.update({
			where: { id: parseInt(courseId) },
			data: {
				in_home_page: apply,
			},
		});

		return NextResponse.json(
			{
				message: "Set in homepage banner.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{
				message: "An error occurred.",
			},
			{ status: 500 }
		);
	}
}
