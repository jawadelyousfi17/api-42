"use server";

import { auth } from "@/lib/auth/auth-provider";
import prisma from "@/lib/prisma/prisma";

export async function getUserData() {
  const session = await auth();

  if (!session || !session.user || !session.user.login) {
    return null;
  }

  const intraUser = await prisma.intraUser.findUnique({
    where: {
      login: session.user.login,
    },
    include: {
      preferences: true,
    },
  });

  return intraUser;
}
