"use server";

import prisma from "@/lib/prisma/prisma";
import { getUserId } from "@/actions/auth/sessionUtils";
import { revalidatePath } from "next/cache";

export async function togglePollStatus(pollId: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" } as const;

  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll) return { error: "Poll not found" } as const;

  const updated = await prisma.poll.update({
    where: { id: pollId },
    data: { active: !poll.active },
    select: { id: true, active: true },
  });

  revalidatePath("/all-polls");
  return { poll: updated } as const;
}
