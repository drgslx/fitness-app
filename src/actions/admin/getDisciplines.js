import prisma from "@/libs/prismadb";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../getCurrentUser";

export async function getDisciplines() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}

	try {
		const disciplines = await prisma.discipline.findMany({
			include: {
				instructor: { // Include associated instructors
					select: {
						
						name: true,
						image: true,
					},
				},
			},
		});
		return { disciplines: disciplines || [] };
	} catch (error) {
		console.error("Error fetching classes:", error);
		return { disciplines: [] }; // Return an empty array as a fallback
	}
}

export async function getDiscipline(params) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}
	const { disciplineId } = params;

	try {
		const disciplineDetails = await prisma.discipline.findUnique({
			where: { id: parseInt(disciplineId) },
			include: {
				instructor: { // Include associated instructors
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
		});
		return { disciplineDetails: disciplineDetails || null }; // Return null as a fallback
	} catch (error) {
		console.error("Error fetching class details:", error);
		return { disciplineDetails: null }; // Return null as a fallback
	}
}
