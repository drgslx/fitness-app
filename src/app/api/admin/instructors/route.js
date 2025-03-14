import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
    const body = await request.json();
    const { name, image, description, categories, videoImage, videoUrl } = body; // Ensure 'categories' is an array of category IDs

    // Validate inputs
    if (!name) {
        return NextResponse.json(
            { message: "Name is required!" },
            { status: 400 }
        );
    } else if (!image) {
        return NextResponse.json(
            { message: "Image is required!" },
            { status: 400 }
        );
    } else if (!description) {
        return NextResponse.json(
            { message: "Description is required!" },
            { status: 400 }
        );
    }else if (!videoImage) {
        return NextResponse.json(
            { message: "Description is required!" },
            { status: 400 }
        );
    } else if (!videoUrl) {
        return NextResponse.json(
            { message: "Description is required!" },
            { status: 400 }
        );
    }  else if (!Array.isArray(categories) || !categories.length) {
        return NextResponse.json(
            { message: "At least one category is required!" },
            { status: 400 }
        );
    }

    try {
        // Create instructor and associate with categories
        const instructor = await prisma.instructor.create({
            data: {
                name,
                image,
                description,
                videoImage,
                videoUrl,
                categories: {
                    create: categories.length > 0 ? categories.map(categoryId => ({
                      category: {
                        connect: {
                          id: categoryId,
                        },
                      },
                    })) : undefined,
                  },
            },
        });

        return NextResponse.json(
            { message: "Instructor created successfully.", instructor },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating instructor:", error);
        return NextResponse.json(
            { message: "An error occurred while creating the instructor." },
            { status: 500 }
        );
    }
}
