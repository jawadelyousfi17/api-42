"use server";

import prisma from "@/lib/prisma/prisma";
import { getUserId } from "@/actions/auth/sessionUtils";
import { PollOptionPosition } from "@/lib/generated/prisma";

export async function voteOnPoll(input: {
  shortId: string;
  position: PollOptionPosition;
}) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" } as const;

  const poll = await prisma.poll.findUnique({
    where: { shortId: input.shortId },
    include: {
      options: { select: { id: true, position: true } },
    },
  });

  if (!poll) return { error: "Poll not found" } as const;

  const option = poll.options.find((o) => o.position === input.position);
  if (!option) return { error: "Option not found" } as const;

  const vote = await prisma.pollVote.upsert({
    where: {
      pollId_userId: {
        pollId: poll.id,
        userId,
      },
    },
    update: {
      optionId: option.id,
    },
    create: {
      pollId: poll.id,
      optionId: option.id,
      userId,
    },
    select: { id: true, pollId: true, optionId: true, userId: true },
  });

  return { vote } as const;
}
