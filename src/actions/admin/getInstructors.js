import prisma from "@/libs/prismadb";

export async function getInstructors() {
    try {
        // Fetch all instructors and include their associated categories through CategoryInstructors
        const instructors = await prisma.instructor.findMany({
            include: {
                categories: {
                    include: {
                        category: true, // Fetch the related category details
                    },
                },
            },
            
        });

        // Transform the data structure to make it easier to access category names
        const transformedInstructors = instructors.map(instructor => ({
            ...instructor,
            categories: instructor.categories.map(({ category }) => category), // Extract category details
        }));

        return { instructors: transformedInstructors || [] };
    } catch (error) {
        console.error("Error fetching instructors:", error);
        return { instructors: [] }; // Return an empty array as a fallback
    }
}

// async function fetchAndLogInstructors() {
//     const result = await getInstructors(); // Call the function
//     console.log(JSON.stringify(result, null, 2)); // Log the result (pretty-printed JSON)
// }

// fetchAndLogInstructors();


export async function getInstructorsById(params) {
    const { instructorID } = params;

    try {
        // Fetch a single instructor by ID and include their associated categories through CategoryInstructors
        const instructor = await prisma.instructor.findUnique({
            where: { id: parseInt(instructorID, 10) },
            include: {
                categories: {
                    include: {
                        category: true, //includes the array of categories
                    },
                },
            },
        });

        // Transform the data structure to make it easier to access category names
        const transformedInstructor = instructor
            ? {
                  ...instructor,
                  categories: instructor.categories.map(({ category }) => category), // Extract category details
              }
            : null;

        return { instructor: transformedInstructor };
    } catch (error) {
        console.error("Error fetching instructor:", error);
        return { instructor: null }; // Return null as a fallback
    }
}