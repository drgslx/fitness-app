import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { courseId } = params;

	if (!courseId) {
		throw new Error("Invalid ID");
	}

	const assets = await prisma.asset.findMany({
		where: { courseId: parseInt(courseId) },
		orderBy: { id: "desc" },
	});

	return NextResponse.json(assets);
}
