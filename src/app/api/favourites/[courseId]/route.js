import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function POST(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { courseId } = params;

	if (!courseId) {
		throw new Error("Invalid ID");
	}

	const favExist = await prisma.favourite.findFirst({
		where: {
			userId: currentUser.id,
			courseId: parseInt(courseId),
		},
	});

	if (favExist) {
		throw new Error("Already exist!");
	}

	const fav = await prisma.favourite.create({
		data: {
			userId: currentUser.id,
			courseId: parseInt(courseId),
		},
	});

	return NextResponse.json(fav);
}

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { courseId } = params;
	if (!courseId) {
		throw new Error("Invalid ID");
	}

	const findFavorite = await prisma.favourite.findFirst({
		where: {
			userId: currentUser.id,
			courseId: parseInt(courseId),
		},
	});
	if (!findFavorite) {
		throw new Error("Not found!");
	}
	const deletedFavorite = await prisma.favourite.delete({
		where: {
			id: findFavorite.id,
		},
	});

	return NextResponse.json(deletedFavorite);
}
