"use server";

import prisma from "@/lib/prisma/prisma";

export async function getPollByShortId(shortId: string) {
  if (!shortId) return null;

  return prisma.poll.findUnique({
    where: { shortId },
    include: {
      creator: { select: { id: true, login: true, name: true, image: true } },
      options: { orderBy: { position: "asc" } },
      votes: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, login: true, name: true, image: true } },
          option: { select: { id: true, position: true } },
        },
      },
    },
  });
}
