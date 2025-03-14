import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	const body = await request.json();
	const { name, image, time, venue, organizer, phone, address, description } = body;

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
	} else if (description == "") {
		return NextResponse.json(
			{
				message: "description is required!",
			},
			{ status: 404 }
		);
	} else if (time == "") {
        return NextResponse.json(
            {
                message: "time is required!",
            },
            { status: 404 }
        );
    } else if (venue == "") {
        return NextResponse.json(
            {
                message: "venue is required!",
            },
            { status: 404 }
        );
    } else if (organizer == "") {
        return NextResponse.json(
            {
                message: "organizer is required!",
            },
            { status: 404 }
        );
    } else if (phone == "") {
        return NextResponse.json(
            {
                message: "phone is required!",
            },
            { status: 404 }
        );
    } else if (address == "") {
        return NextResponse.json(
            {
                message: "phone is required!",
            },
            { status: 404 }
        );
    } 


	await prisma.event.create({
		data: {
			name,
			image,
			time,
			description,
            venue,
            organizer,
            phone,
            address,
		},
	});

	return NextResponse.json(
		{ message: "Event created successfully." },
		{ status: 200 }
	);
}
