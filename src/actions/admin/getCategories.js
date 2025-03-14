import prisma from "@/libs/prismadb";

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                instructors: {
                    include: {
                        instructor: true, // Fetch instructor details
                    },
                },
                schedule: true, // Fetch schedule details for each category
            },
        });
        return { categories: categories || [] };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [] }; // Return an empty array as fallback
    }
}


export async function getCategoryById(params) {
    const { catId } = params;

    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(catId) },
            include: {
                instructors: {
                    include: {
                        instructor: true, // Fetch instructor details
                    },
                },
                schedule: true, // Fetch schedule details for this specific category
            },
        });
        return { category: category || null }; // Return null as fallback
    } catch (error) {
        console.error("Error fetching category:", error);
        return { category: null }; // Return null as fallback
    }
}

