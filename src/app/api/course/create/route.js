import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { slugify } from "@/utils/slugify";

export async function POST(request) {
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
			category,
			title,
			overview,
			regular_price,
			before_price,
			lessons,
			duration,
			image,
			access_time,
			requirements,
			what_you_will_learn,
			who_is_this_course_for,
		} = body;

		let slug = slugify(title);
		const slugExist = await prisma.course.findFirst({
			where: {
				slug: slug,
			},
		});

		if (slugExist) {
			slug = `${slug}-${Math.floor(
				Math.random() * (999 - 100 + 1) + 100
			)}`;
		}

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

		const course = await prisma.course.create({
			data: {
				title,
				slug,
				catId: category.value,
				overview,
				regular_price: parseFloat(regular_price),
				before_price: parseFloat(before_price),
				lessons,
				duration,
				image,
				access_time: access_time.value,
				requirements,
				what_you_will_learn,
				who_is_this_course_for,
				userId: currentUser.id,
			},
		});

		return NextResponse.json(
			{
				message: "Course submitted & get approve soon.",
				course,
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
