"use server";

import prisma from "@/lib/prisma/prisma";
import axios from "axios";

async function tokenDb() {
  try {
    const token = await prisma.token.findUnique({
      where: {
        id: "1",
      },
    });

    console.log("token = ", token);
    return token;
  } catch (error) {
    return null;
  }
}

export async function getAccessToken() {
  const token = await tokenDb();
  if (!token) return null;

  const accessToken = token.acessToken;
  const refreshToken = token.refreshToken;

  try {
    await axios.get("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return accessToken;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          "https://api.intra.42.fr/oauth/token",
          {
            grant_type: "refresh_token",
            client_id: process.env.TOKEN_UID,
            client_secret: process.env.OKEN_SECRET,
            refresh_token: refreshToken,
          }
        );

        await prisma.token.update({
          where: {
            id: "1",
          },
          data: {
            acessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
        });

        return data.access_token;
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return null;
      }
    }
    return null;
  }
}
