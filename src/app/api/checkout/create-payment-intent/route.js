import { getCurrentUser } from "@/actions/getCurrentUser";
import { cartTotal } from "@/utils/cartTotal";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	typescript: true,
	apiVersion: "2023-10-16",
});

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
		data: { cart },
	} = await request.json();

	if (cart.length === 0) {
		return NextResponse.json(
			{
				message: "Your cart is empty.",
			},
			{ status: 400 }
		);
	}

	const payableAmount = cartTotal(cart);

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Number(payableAmount) * 100,
			currency: "USD",
		});

		if (paymentIntent) {
			for (const course of cart) {
				// console.log(paymentIntent);
				await prisma.enrolment.create({
					data: {
						userId: currentUser.id,
						courseId: course.id,
						order_number: generateOrderNumber(),
						price: Number(course.regular_price),
						paymentId: paymentIntent.id,
						payment_via: "Stripe",
					},
				});
			}
		}

		return NextResponse.json(paymentIntent, { status: 200 });
	} catch (error) {
		return new NextResponse(error, {
			status: 400,
		});
	}
}

function generateOrderNumber() {
	return `ORD-${Math.floor(Math.random() * 10000)}`;
}
