import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request, { params }) {
	const { userId } = params;

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

		const { admin } = body;

		await prisma.user.update({
			where: { id: parseInt(userId) },
			data: {
				role: admin == "ADMIN" ? "MODERATOR" : "ADMIN",
			},
		});

		return NextResponse.json(
			{
				message: "Done.",
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


export async function DELETE(request, { params }) {
	const { userId } = params;
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

		await prisma.user.delete({
			where: { id: parseInt(userId) },
		});
		return NextResponse.json(
			{
				message: "Done.",
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
