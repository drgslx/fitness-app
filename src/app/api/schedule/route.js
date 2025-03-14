// app/api/schedule/route.js

import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";  // Ensure this path is correct

export async function POST(request) {
  const body = await request.json();
  const { time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } = body;

  if (!time) {
    return NextResponse.json({ message: "Time is required!" }, { status: 400 });
  }

  try {
    const newSchedule = await prisma.schedule.create({
      data: { time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ message: 'Error creating schedule' }, { status: 500 });
  }
}
