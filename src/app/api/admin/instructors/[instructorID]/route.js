import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function PUT(request, { params }) {
  const body = await request.json();
  const { instructorID } = params;
  const { name, image, description, categories, videoImage, videoUrl } = body; // Categories is an array of category IDs

  if (!instructorID) {
    return NextResponse.json(
      { message: "Instructor ID is required!" },
      { status: 400 }
    );
  }

  if (!name || !image || !description || !categories || !categories.length || !videoImage || !videoUrl) {
    return NextResponse.json(
      { message: "Name, image, description, videoImage, and videoUrl are required!" },
      { status: 400 }
    );
  }

  try {
    // Fetch the instructor and related categories
    const currentInstructor = await prisma.instructor.findUnique({
      where: { id: parseInt(instructorID, 10) },
      include: { categories: true },
    });

    if (!currentInstructor) {
      return NextResponse.json(
        { message: "Instructor not found!" },
        { status: 404 }
      );
    }

    // Extract current category IDs
    const currentCategoryIds = currentInstructor.categories.map(cat => cat.categoryId);

    // Determine categories to disconnect
    const categoriesToDisconnect = currentInstructor.categories
      .filter(cat => !categories.includes(cat.categoryId))
      .map(cat => ({
        categoryId: cat.categoryId,
        instructorId: parseInt(instructorID, 10),
      }));

    // Determine categories to connect
    const categoriesToConnect = categories
      .filter(categoryId => !currentCategoryIds.includes(categoryId))
      .map(categoryId => ({
        categoryId,
        instructorId: parseInt(instructorID, 10),
      }));

    // Update the instructor
    const updatedInstructor = await prisma.instructor.update({
        where: { id: parseInt(instructorID, 10) },
        data: {
          name,
          image,
          description,
          videoImage,
          videoUrl,
          categories: {
            create: categoriesToConnect.length > 0 ? categoriesToConnect.map(cat => ({
              category: {
                connect: {
                  id: cat.categoryId,
                },
              },
            })) : undefined,
            deleteMany: categoriesToDisconnect.length > 0 ? categoriesToDisconnect : undefined,
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

    return NextResponse.json(
      { message: "Instructor updated successfully.", instructor: updatedInstructor },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the instructor." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
    const { instructorID } = params;

    // Check if the instructorID is present and valid
    if (!instructorID || isNaN(parseInt(instructorID))) {
        return NextResponse.json(
            { message: "Valid Instructor ID is required!" },
            { status: 400 }
        );
    }

    try {
        await prisma.instructor.delete({
            where: { id: parseInt(instructorID) },
        });

        return NextResponse.json(
            { message: "Instructor deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting instructor:", error);
        return NextResponse.json(
            { message: "Error deleting instructor!", error: error.message },
            { status: 500 }
        );
    }
}
