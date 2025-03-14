import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	const body = await request.json();
	const { title, image } = body;

	if (title == "") {
		return NextResponse.json(
			{
				message: "Title is required!",
			},
			{ status: 404 }
		);
	} else if (image == "") {
		return NextResponse.json(
			{
				message: "Image is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.gallery.create({
		data: {
			title,
			image,
		},
	});

	return NextResponse.json(
		{ message: "Gallery created successfully." },
		{ status: 200 }
	);
}
