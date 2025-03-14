import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { formatDuration } from "@/utils/formatDuration";

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
		const {
			group_name,
			title,
			thumb_Image,
			video: { secure_url, duration },
			is_preview,
			short_id,
		} = body;

		Object.keys(body).forEach((value) => {
			if (!body[value]) {
				NextResponse.json(
					{
						message: "One or more fileds are empty!",
					},
					{ status: 404 }
				);
			}
		});

		const video_length = formatDuration(duration);

		await prisma.video.create({
			data: {
				group_name,
				title,
				thumb_Image,
				video_url: secure_url,
				video_length,
				is_preview: is_preview || false,
				short_id: parseInt(short_id),
				courseId: parseInt(courseId),
			},
		});

		return NextResponse.json(
			{
				message: "Video uploaded.",
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
	const { courseId: videoId } = params;
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

		await prisma.video.delete({
			where: {
				id: parseInt(videoId),
			},
		});

		return NextResponse.json(
			{
				message: "Video deleted.",
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
