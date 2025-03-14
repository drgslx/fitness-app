import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const { partnerId } = params;

	if (partnerId == "") {
		return NextResponse.json(
			{
				message: "Name is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.partner.delete({
		where: { id: parseInt(partnerId) },
	});

	return NextResponse.json(
		{ message: "Partner deleted successfully." },
		{ status: 200 }
	);
}
