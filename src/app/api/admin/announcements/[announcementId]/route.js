import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request, { params }) {
	const { announcementId } = params;
	if (announcementId == "") {
		return NextResponse.json(
			{
				message: "announcementId is required!",
			},
			{ status: 404 }
		);
	}
	const body = await request.json();
	const { homeAnnouncement, scheduleAnnouncement } = body;


	await prisma.announcement.update({
		where: { id: parseInt(announcementId) },
		data: {
			homeAnnouncement,
			scheduleAnnouncement,
		},
	});

	return NextResponse.json(
		{ message: "Announcement updated successfully." },
		{ status: 200 }
	);
}

