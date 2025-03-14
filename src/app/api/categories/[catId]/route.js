import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request, { params }) {
    const { catId } = params;

    if (!catId) {
        return NextResponse.json(
            { message: "id is required!" },
            { status: 400 }
        );
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(catId) },
            include: {
                instructors: {
                    include: {
                        instructor: true, // Include related Category data
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found!" },
                { status: 404 }
            );
        }

        // Transform the data structure to include categories directly
        const transformedCategory = {
            ...category,
            instructors: category.instructors.map(({ instructor }) => instructor), // Extract category details
        };

        return NextResponse.json(transformedCategory, { status: 200 });
    } catch (error) {
        console.error("Error fetching instructor:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching the instructor." },
            { status: 500 }
        );
    }
}
