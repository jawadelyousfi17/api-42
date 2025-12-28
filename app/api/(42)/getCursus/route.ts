import { getAllUsers } from "@/actions/42/getAllCursus";
import { updateUsers } from "@/actions/42/updateUsersToDb";
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

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

  const data = await getAllUsers(token, 16);

  const users: UserDataFromApi[] = data.map((user) => {
    return {
      fullName: user.user.displayname as string,
      avatar: user.user.image.versions.medium as string,
      login: user.user.login as string,
      level: user.level as number,
      promo: getPromo(user.begin_at) as number,
      campusId: 16,
    };
  });

  return NextResponse.json({
    message: "message",
    token: token,
    users: users,
  });
}
