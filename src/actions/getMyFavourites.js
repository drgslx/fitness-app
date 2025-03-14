import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export async function getMyFavourites() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/");
	}
	try {
		const favourites = await prisma.favourite.findMany({
			where: { userId: currentUser.id },
			orderBy: {
				id: "desc",
			},
			include: {
				course: {
					include: {
						user: true,
						reviews: true,
						category: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		return { favourites };
	} catch (error) {
		console.error("Error fetching counts:", error);
	}
}
