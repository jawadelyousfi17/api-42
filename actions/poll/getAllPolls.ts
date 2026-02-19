"use server";

import prisma from "@/lib/prisma/prisma";

export async function getAllPolls() {
  return prisma.poll.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, login: true, name: true, image: true } },
      options: { orderBy: { position: "asc" } },
      _count: { select: { votes: true } },
      votes: {
        include: {
          option: { select: { id: true, position: true } },
          user: { select: { id: true, login: true, name: true, image: true } },
        },
      },
    },
  });
}

export type PollWithDetails = Awaited<ReturnType<typeof getAllPolls>>[number];
