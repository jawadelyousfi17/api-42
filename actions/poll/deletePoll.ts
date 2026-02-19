"use server";

import prisma from "@/lib/prisma/prisma";

import { revalidatePath } from "next/cache";
import { getUserId } from "../auth/sessionUtils";

export async function deletePoll(pollId: string) {
  const userId = await getUserId();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
  });

  if (!poll) {
    return { error: "Poll not found" };
  }

  if (poll.creatorId !== userId) {
    return { error: "Unauthorized: You are not the creator of this poll" };
  }

  try {
    await prisma.poll.delete({
      where: { id: pollId },
    });
    revalidatePath("/all-polls");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete poll:", error);
    return { error: "Failed to delete poll" };
  }
}
