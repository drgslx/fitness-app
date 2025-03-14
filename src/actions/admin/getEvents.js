import prisma from "@/libs/prismadb";
import { getCurrentUser } from "../getCurrentUser";
import { redirect } from "next/navigation";

function formatEventDates(event) {
    return {
        ...event,
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at.toISOString(),
        time: event.time.toISOString(), // Assuming event.time is a Date object
    };
}
export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                created_at: 'desc', // Order by created_at in descending order
            },
        });
        return { events: events.map(formatEventDates) };
    } catch (error) {
        console.error("Error fetching events:", error);
        return { events: [] };
    }
}

export async function getEventById({ eventID }) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/");
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventID) },
        });
        return { event: event ? formatEventDates(event) : null };
    } catch (error) {
        console.error("Error fetching event:", error);
        return { event: null };
    }
}
