import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	const body = await request.json();
	const { name, image, designation, description } = body;

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
	} else if (designation == "") {
		return NextResponse.json(
			{
				message: "designation is required!",
			},
			{ status: 404 }
		);
	} else if (description == "") {
		return NextResponse.json(
			{
				message: "description is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.testimonial.create({
		data: {
			name,
			image,
			designation,
			description,
		},
	});

	return NextResponse.json(
		{ message: "Testimonial created successfully." },
		{ status: 200 }
	);
}
