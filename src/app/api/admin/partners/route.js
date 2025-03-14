import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	const body = await request.json();
	const { name, image } = body;

	if (name == "") {
		return NextResponse.json(
			{
				message: "Name is required!",
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

	await prisma.partner.create({
		data: {
			name,
			image,
		},
	});

	return NextResponse.json(
		{ message: "Partner created successfully." },
		{ status: 200 }
	);
}
