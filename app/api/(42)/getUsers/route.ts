import { getAllUsers } from "@/actions/42/getAllCursus";
import { getAllUsersFromDb } from "@/actions/42/getAllUsersDb";
import { syncStudents, updateUsers } from "@/actions/42/updateUsersToDb";
import prisma from "@/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

function getPromo(beginDate: string) {
  if (beginDate.includes("2025")) return 2025;
  if (beginDate.includes("2024")) return 2024;
  if (beginDate.includes("2023")) return 2023;
  if (beginDate.includes("2022")) return 2022;
  if (beginDate.includes("2021")) return 2021;
}

export type UserDataFromApi = {
  fullName: string;
  avatar: string;
  login: string;
  level: number;
  promo: number;
  campusId: number;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const TOKEN =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : undefined;

  // check the token
  try {
    const response = await fetch("https://api.intra.42.fr/v2/users/195219", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const year = request.nextUrl.searchParams.get("year");
  const campId = request.nextUrl.searchParams.get("campusId");

  const promo = year ? parseInt(year) : 2024;
  const id = campId ? parseInt(campId) : 55;

  const users = await getAllUsersFromDb({ promo, id });

  const task = await prisma.task.findFirst();

  if (TOKEN) {
    if (!task?.active) {
      // trigger a sync students usign the access token in the barear
      await prisma.task.update({
        where: {
          id: "1",
        },
        data: {
          active: true,
        },
      });
      syncStudents(15, TOKEN)
        .then(() => syncStudents(55, TOKEN))
        // .then(() => syncStudents(16, TOKEN))
        // .then(() => syncStudents(75, TOKEN))
        .finally(() => {
          setTimeout(
            async () =>
              await prisma.task.update({
                where: { id: "1" },
                data: { active: false },
              }),
            1000
          );
        });
    }
  }

  return NextResponse.json(
    {
      message: "OK",
      lastUpdate: task?.updatedAt,
      users: users,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
