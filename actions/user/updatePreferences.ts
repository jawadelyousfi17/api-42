"use server";

import { auth } from "@/lib/auth/auth-provider";
import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

import { uploadAvatar } from "../file/imageUpload";

export async function updatePreferences(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.login) {
    throw new Error("Unauthorized");
  }

  const login = session.user.login;

  const avatarFile = formData.get("avatar") as File;
  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const uploadResult = await uploadAvatar(avatarFile);
    if (uploadResult.error) {
      throw new Error(uploadResult.error);
    }
    avatarUrl = uploadResult.url;
  }

  const coverFile = formData.get("cover") as File;
  let coverUrl: string | undefined;

  if (coverFile && coverFile.size > 0) {
    const uploadResult = await uploadAvatar(coverFile);
    if (uploadResult.error) {
      throw new Error(uploadResult.error);
    }
    coverUrl = uploadResult.url;
  }

  // Social links - collecting them from form data
  const github = formData.get("github") as string;
  const linkedin = formData.get("linkedin") as string;
  const twitter = formData.get("twitter") as string;
  const instagram = formData.get("instagram") as string;

  const socialLinks = JSON.stringify({
    github,
    linkedin,
    twitter,
    instagram,
  });

  const changeProfile = formData.get("changeProfile") === "on";
  const changeCover = formData.get("changeCover") === "on";
  const showQuranInFullScreen = formData.get("showQuranInFullScreen") === "on";
  const showQuranWidget = formData.get("showQuranWidget") === "on";
  const showRanking = formData.get("showRanking") === "on";
  const showPomodor = formData.get("showPomodor") === "on";
  const showNotes = formData.get("showNotes") === "on";

  // Find the IntraUser first
  const intraUser = await prisma.intraUser.findUnique({
    where: { login },
    include: { preferences: true },
  });

  if (!intraUser) {
    throw new Error("User not found");
  }

  // Update IntraUser fields
  await prisma.intraUser.update({
    where: { login },
    data: {
      ...(avatarUrl && { avatar: avatarUrl }),
      ...(coverUrl && { cover: coverUrl }),
      socialLinks,
    },
  });

  // Update or Create Preferences
  if (intraUser.preferences.length > 0) {
    const prefId = intraUser.preferences[0].id;
    await prisma.preferences.update({
      where: { id: prefId },
      data: {
        changeProfile,
        changeCover,
        showQuranInFullScreen,
        showQuranWidget,
        showRanking,
        showPomodor,
        showNotes,
      },
    });
  } else {
    await prisma.preferences.create({
      data: {
        intraUserId: intraUser.id,
        changeProfile,
        changeCover,
        showQuranInFullScreen,
        showQuranWidget,
        showRanking,
        showPomodor,
        showNotes,
      },
    });
  }

  revalidatePath("/prefrence");
}
