import prisma from "@/libs/prismadb";

export async function getGallery() {
	try {
		const gallery = await prisma.gallery.findMany({});
		return { gallery: gallery || [] };
	} catch (error) {
		console.error("Error fetching galleryPictures:", error);
		return { gallery: [] }; // Return an empty array as a fallback
	}
}