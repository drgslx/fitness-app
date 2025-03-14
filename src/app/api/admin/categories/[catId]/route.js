import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request, { params }) {
  const { catId } = params;

  if (!catId) {
    return NextResponse.json(
      {
        message: "catId is required!",
      },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, image, description } = body;

  if (!name) {
    return NextResponse.json(
      {
        message: "Name is required!",
      },
      { status: 400 }
    );
  }

  if (!image) {
    return NextResponse.json(
      {
        message: "Image is required!",
      },
      { status: 400 }
    );
  }

  if (!description) {
    return NextResponse.json(
      {
        message: "Description is required!",
      },
      { status: 400 }
    );
  }

  try {
    const categoryId = parseInt(catId);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid catId provided!" },
        { status: 400 }
      );
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        image,
        description,
      },
    });

    return NextResponse.json(
      { message: "Category updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { catId } = params;

  if (!catId) {
    return NextResponse.json(
      {
        message: "catId is required!",
      },
      { status: 400 }
    );
  }

  try {
    const categoryId = parseInt(catId);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid catId provided!" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 }
    );
  }
}
