import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request, { params }) {
    const { instructorID } = params;

    if (!instructorID) {
        return NextResponse.json(
            { message: "id is required!" },
            { status: 400 }
        );
    }

    try {
        // Fetch instructor with associated categories
        const instructor = await prisma.instructor.findUnique({
            where: { id: parseInt(instructorID) },
            include: {
                categories: {
                    include: {
                        category: true, // Include related Category data
                    },
                },
            },
        });

        if (!instructor) {
            return NextResponse.json(
                { message: "Instructor not found!" },
                { status: 404 }
            );
        }

        // Transform the data structure to include categories directly
        const transformedInstructor = {
            ...instructor,
            categories: instructor.categories.map(({ category }) => category), // Extract category details
        };

        return NextResponse.json(transformedInstructor, { status: 200 });
    } catch (error) {
        console.error("Error fetching instructor:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching the instructor." },
            { status: 500 }
        );
    }
}
