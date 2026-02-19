"use server";

import prisma from "@/lib/prisma/prisma";
import { getUserId } from "@/actions/auth/sessionUtils";
import { generateShortId } from "@/lib/poll/shortId";
import { PollOptionPosition } from "@/lib/generated/prisma";

type CreatePollOptionInput = {
  name: string;
  cover: string;
  description?: string;
};

export async function createPoll(input: {
  optionA: CreatePollOptionInput;
  optionB: CreatePollOptionInput;
}) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" } as const;

  const optionA = input.optionA;
  const optionB = input.optionB;

  if (!optionA?.name || !optionA?.cover || !optionB?.name || !optionB?.cover) {
    return { error: "Both options require name and cover" } as const;
  }

  // Try a few times to avoid rare shortId collisions.
  for (let attempt = 0; attempt < 8; attempt++) {
    const shortId = generateShortId(8);
    const existing = await prisma.poll.findUnique({ where: { shortId } });
    if (existing) continue;

    const poll = await prisma.poll.create({
      data: {
        shortId,
        creatorId: userId,
        options: {
          create: [
            {
              position: PollOptionPosition.A,
              name: optionA.name,
              cover: optionA.cover,
              description: optionA.description,
            },
            {
              position: PollOptionPosition.B,
              name: optionB.name,
              cover: optionB.cover,
              description: optionB.description,
            },
          ],
        },
      },
      select: { id: true, shortId: true },
    });

    return { poll } as const;
  }

  return { error: "Failed to generate unique poll id" } as const;
}
