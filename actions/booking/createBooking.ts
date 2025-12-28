"use server";

import prisma from "@/lib/prisma/prisma";
import { getUserId } from "../auth/sessionUtils";

export async function createBooking(startDate: Date, gymId: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not autenticated" };

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        gymId: gymId,
        startTime: startDate,
        date: startDate,
      },
    });

    if (!booking) return { error: "Not booked" };
    return { message: "booked" };
  } catch (error) {
    return { error: "Not booked" };
  }
}
