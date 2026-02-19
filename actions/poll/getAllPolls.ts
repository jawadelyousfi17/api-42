"use server";

import prisma from "@/lib/prisma/prisma";
import { auth } from "@/lib/auth/auth-provider";

export async function getAllPolls() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  return prisma.poll.findMany({
    where: {
      creatorId: session.user.id,
    },
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
