// src/app/api/schedule/[id]/route.js (or pages/api/schedule/[id].js)
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

// Handle PUT requests
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } = body;

    // Validation
    

    // Update schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { id: parseInt(id, 10) },
      data: {
        time,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday
      }
    });

    return NextResponse.json(
      { message: "Schedule updated successfully.", updatedSchedule },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { message: "Error updating schedule." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params; // Extract the schedule ID from the route params

  if (!id) {
      return NextResponse.json(
          { message: "idis required!" },
          { status: 400 }
      );
  }

  try {
      await prisma.schedule.delete({
          where: { id: parseInt(id) },
      });

      return NextResponse.json(
          { message: "Schedule deleted successfully." },
          { status: 200 }
      );
  } catch (error) {
      console.error("Error deleting schedule:", error);
      return NextResponse.json(
          { message: "Error deleting schedule." },
          { status: 500 }
      );
  }
}
