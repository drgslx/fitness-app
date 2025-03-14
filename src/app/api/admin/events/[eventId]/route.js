import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request, { params }) {
    
	const { eventId } = params;
	if (eventId == "") {
		return NextResponse.json(
			{
				message: "eventId is required!",
			},
			{ status: 404 }
		);
	}
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

	await prisma.event.update({
		where: { id: parseInt(eventId) },
		data: {
			name,
			image,
			description,
            time,
            venue,
            organizer,
            phone,
            address,
		},
	});

	return NextResponse.json(
		{ message: "instructor updated successfully." },
		{ status: 200 }
	);
}
export async function DELETE(request, { params }) {
	const { eventId } = params;

	if (eventId == "") {
		return NextResponse.json(
			{
				message: "eventId is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.event.delete({
		where: { id: parseInt(eventId) },
	});

	return NextResponse.json(
		{ message: "Event deleted successfully!" },
		{ status: 200 }
	);
}
