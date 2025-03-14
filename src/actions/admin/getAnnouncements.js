import prisma from "@/libs/prismadb";

export async function getAnnouncements() {
	try {
		const announcements = await prisma.announcement.findMany({});
		return { announcements: announcements || [] };
	} catch (error) {
		console.error("Error fetching announcement:", error);
		return { announcements: [] }; // Return an empty array as a fallback
	}
}

export async function getAnnouncementById(params) {
    const { announcementId } = params;

    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: parseInt(announcementId) },
            
        });
        return { announcement: announcement || null }; // Return null as fallback
    } catch (error) {
        console.error("Error fetching announcement:", error);
        return { announcement: null }; // Return null as fallback
    }
}