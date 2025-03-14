import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { courseId } = params;
	const body = await request.json();
	const { videoId } = body;

	if (!courseId) {
		throw new Error("Invalid ID");
	}

	const progress = await prisma.progress.findFirst({
		where: {
			userId: currentUser.id,
			courseId: parseInt(courseId),
			videoId: parseInt(videoId),
		},
	});

	if (!progress) {
		await prisma.progress.create({
			data: {
				finished: true,
				userId: currentUser.id,
				courseId: parseInt(courseId),
				videoId: parseInt(videoId),
			},
		});
	}

	return NextResponse.json(new Date());
}

export async function GET(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { courseId } = params;

	if (!courseId) {
		throw new Error("Invalid ID");
	}

	const courseProgress = await prisma.progress.findMany({
		where: { userId: currentUser.id, courseId: parseInt(courseId) },
	});

	return NextResponse.json(courseProgress);
}
