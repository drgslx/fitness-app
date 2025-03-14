import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { slugify } from "@/utils/slugify";

export async function POST(request) {
	const body = await request.json();
	const { name, description, image } = body; // Ensure no `id` is included

	// Validate the input
	if (!name || name.trim() === "") {
		return NextResponse.json(
			{ message: "Name is required!" },
			{ status: 400 }
		);
	}

	// Check if the category already exists
	const existingCategory = await prisma.category.findFirst({
		where: { name: name.trim() },
	});
	if (existingCategory) {
		return NextResponse.json(
			{ message: "Category already exists." },
			{ status: 400 }
		);
	}

	// Generate slug
	let slug = slugify(name);
	const slugExist = await prisma.category.findFirst({
		where: { slug: slug },
	});
	if (slugExist) {
		slug = `${slug}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`;
	}

	// Create the new category with additional fields
	await prisma.category.create({
		data: {
			name: name.trim(),
			description: description || "default description", // Default description if not provided
			image: image || "public/images/classes/muay.jpg", // Default image path if not provided
			slug,
		},
	});

	return NextResponse.json(
		{ message: "Category created successfully." },
		{ status: 201 }
	);
}
