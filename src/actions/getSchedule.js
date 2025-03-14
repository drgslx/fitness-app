import prisma from "@/libs/prismadb";

export async function getSchedule() {
	try {
		const schedule = await prisma.schedule.findMany({});
		return { schedule: schedule || [] };
	} catch (error) {
		console.error("Error fetching schedule:", error);
		return { schedule: [] }; // Return an empty array as a fallback
	}
}