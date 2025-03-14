import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const body = await request.json();
	const {
		name,
		image,
		gender,
		designation,
		bio,
		location,
		phone,
		website,
		twitter,
		facebook,
		linkedin,
		youtube,
	} = body;

	if (name == "") {
		return NextResponse.json(
			{
				message: "Name is required!",
			},
			{ status: 404 }
		);
	}

	await prisma.user.update({
		where: { id: currentUser.id },
		data: {
			name,
			image,
			designation,
			gender,
		},
	});

	if (currentUser.profile) {
		await prisma.profile.update({
			where: { userId: currentUser.id },
			data: {
				bio,
				location,
				phone,
				website,
				twitter,
				facebook,
				linkedin,
				youtube,
			},
		});
	} else {
		await prisma.profile.create({
			data: {
				bio,
				location,
				phone,
				website,
				twitter,
				facebook,
				linkedin,
				youtube,
				userId: currentUser.id,
			},
		});
	}

	return NextResponse.json(
		{
			message: "Profile updated successfully",
		},
		{ status: 200 }
	);
}
