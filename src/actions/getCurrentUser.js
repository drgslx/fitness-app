import { getServerSession } from "next-auth/next";
import { authHandler } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

export async function getCurrentSession() {
	return await getServerSession(authHandler);
}

export async function getCurrentUser() {
	try {
		const session = await getCurrentSession();

		if (!session?.user?.email) {
			return null;
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
			include: {
				profile: true,
				favourites: true,
			},
		});

		if (!currentUser) {
			return null;
		}

		return {
			...currentUser,
			created_at: currentUser.created_at.toISOString(),
			updated_at: currentUser.created_at.toISOString(),
			emailVerified: currentUser.created_at.toISOString() || null,
		};
	} catch (error) {
		return null;
	}
}
