import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
    const body = await request.json();
    const { name, image, description, categories,videoImage, videoUrl } = body;

    if (!name || !image || !description || !categories || !categories.length || !videoImage || !videoUrl) {
        return NextResponse.json(
            { message: "All fields are required!" },
            { status: 400 }
        );
    }

    try {
        // Create instructor
        const instructor = await prisma.instructor.create({
            data: {
                name,
                image,
                description,
                videoImage,
                videoUrl,
                categories: {
                    connect: categories.map((category) => ({ id: categoryId })),
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
            { message: "Error creating instructor." },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const body = await request.json();
    const { id, name, image, description, categories, videoImage, videoUrl } = body;

    if (!id || !name || !image || !description || !categories || !categories.length || !videoImage || !videoUrl) {
        return NextResponse.json(
            { message: "ID, name, image, and description are required!" },
            { status: 400 }
        );
    }

    try {
        // Update instructor
        const instructor = await prisma.instructor.update({
            where: { id },
            data: {
                name,
                image,
                description,
                videoImage,
                videoUrl,
                categories: {
                    set: categories.map((categoryId) => ({ id: categoryId })),
                },
            },
            include: {
                categories: true, // Include updated categories if needed
            },
        });

        return NextResponse.json(
            { message: "Instructor updated successfully.", instructor },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating instructor:", error);
        return NextResponse.json(
            { message: "Error updating instructor." },
            { status: 500 }
        );
    }
}
