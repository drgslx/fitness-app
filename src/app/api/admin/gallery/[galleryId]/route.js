import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const { galleryId } = params;

	if (galleryId == "") {
		return NextResponse.json(
			{
				message: "Name is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.gallery.delete({
		where: { id: parseInt(galleryId) },
	});

	return NextResponse.json(
		{ message: "Gallery Picture deleted successfully." },
		{ status: 200 }
	);
}
