import { getAllUsers } from "@/actions/42/getAllCursus";
import { getAllUsersFromDb } from "@/actions/42/getAllUsersDb";
import { updateUsers } from "@/actions/42/updateUsersToDb";
import prisma from "@/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const login = request.nextUrl.searchParams.get("login");

  if (!login) {
    return NextResponse.json(
      { error: "Login parameter is required" },
      { status: 400 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const TOKEN =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : undefined;

  // check the token
  if (!TOKEN)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  try {
    const user = await prisma.intraUser.findUnique({
      where: { login: login },
    });

    return NextResponse.json(
      {
        message: "OK",
        user: user,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
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
