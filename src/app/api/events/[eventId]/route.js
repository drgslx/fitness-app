import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request, { params }) {
    const { eventId } = params;

    if (!eventId) {
        return NextResponse.json(
            { message: "id is required!" },
            { status: 400 }
        );
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) },
        });

        if (!event) {
            return NextResponse.json(
                { message: "Instructor not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching the events." },
            { status: 500 }
        );
    }
}
