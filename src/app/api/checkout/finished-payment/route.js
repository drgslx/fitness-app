import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/libs/prismadb";

export async function DELETE(request) {
	const { payment_id } = await request.json();

	const enrolment = await prisma.enrolment.findMany({
		where: {
			paymentId: payment_id,
		},
	});

	// console.log(enrolment);

	if (enrolment) {
		for (const order of enrolment) {
			await prisma.enrolment.delete({
				where: { id: order.id },
			});
		}
	}

	return NextResponse.json(
		{
			message: "Delete.",
		},
		{ status: 200 }
	);
}

export async function POST(request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.json(
			{
				message: "Unauthorized user.",
			},
			{ status: 401 }
		);
	}

	const {
		data: { paymentIntent },
	} = await request.json();

	const enrolment = await prisma.enrolment.findMany({
		where: {
			paymentId: paymentIntent.id,
		},
	});

	if (enrolment) {
		for (const order of enrolment) {
			await prisma.enrolment.update({
				where: { id: order.id },
				data: {
					payment_status: "PAID",
					status: "PAID",
				},
			});
		}
	}

	return NextResponse.json(
		{ message: "Payment Succeeded." },
		{
			status: 200,
		}
	);
}
