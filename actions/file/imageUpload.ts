"use server";

import { createClient } from "@/lib/supabase/server";

import prisma from "@/lib/prisma/prisma";

export type T_UploadState = {
  message?: string;
  error?: string;
  url?: string;
};

export async function uploadAvatar(file: File): Promise<T_UploadState> {
  const supabase = await createClient();

  if (!file) return { error: "No file provided" };

  if (!file.type.startsWith("image/"))
    return { error: "Must be a valid image format" };

  const maxSize = 6 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      error: `Image size must be less than 6MB`,
    };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `/${fileName}`;

    const { data, error } = await supabase.storage
      .from("public_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log("err = ", error);
    if (error) return { error: error.message };

    const {
      data: { publicUrl },
    } = supabase.storage.from("public_images").getPublicUrl(data.path);

    return {
      message: "avatar uploaded succesfauly",
      url: publicUrl,
    };
  } catch (error) {
    return { error: "Unkown error was accured, try later" };
  }
}
