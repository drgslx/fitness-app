import prisma from "@/libs/prismadb";

export async function getPartners() {
	try {
		const partners = await prisma.partner.findMany({});
		return { partners: partners || [] };
	} catch (error) {
		console.error("Error fetching partners:", error);
		return { partners: [] }; // Return an empty array as a fallback
	}
}