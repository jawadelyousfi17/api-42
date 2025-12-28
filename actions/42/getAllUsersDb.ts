"use server";

import prisma from "@/lib/prisma/prisma";

export async function getAllUsersFromDb({
  promo,
  id,
}: {
  promo: number;
  id: number;
}) {
  try {
    const users = await prisma.intraUser.findMany({
      where: {
        promo: promo,
        campusId: id,
      },
      orderBy: {
        rank: "asc",
      },
    });
    return users;
  } catch (error) {
    return null;
  }
}
