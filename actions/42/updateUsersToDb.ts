"use server";

import prisma from "@/lib/prisma/prisma";
import { getAllUsers } from "./getAllCursus";
import { getAccessToken } from "./getToken";

function getPromo(beginDate: string) {
  if (beginDate.includes("2025")) return 2025;
  if (beginDate.includes("2024")) return 2024;
  if (beginDate.includes("2023")) return 2023;
  if (beginDate.includes("2022")) return 2022;
  if (beginDate.includes("2021")) return 2021;
  if (beginDate.includes("2020")) return 2020;
  if (beginDate.includes("2019")) return 2019;
  if (beginDate.includes("2018")) return 2018;
  if (beginDate.includes("2017")) return 2017;
  if (beginDate.includes("2016")) return 2016;
}

type UserDataFromApi = {
  fullName: string;
  avatar: string;
  login: string;
  level: number;
  promo: number;
  campusId: number;
  rank: number;
};

export async function updateUsers(users: UserDataFromApi[]) {
  for (let a of users) {
    try {
      await prisma.intraUser.upsert({
        where: {
          login: a.login,
        },
        update: {
          level: a.level,
          rank: a.rank,
        },
        create: {
          login: a.login,
          name: a.fullName,
          level: a.level,
          campusId: a.campusId,
          avatar: a.avatar || "GG",
          promo: a.promo,
          rank: a.rank,
        },
      });
    } catch (error) {
      console.log("ERROR UPDAING USERS IN DB");
      return { error: "Error" };
    }
  }

  return { message: "OK" };
}

export async function syncStudents(campusId: number, token: string) {
  console.log("Statrting for campus ", campusId);

  const data = await getAllUsers(token, campusId);

  const users: UserDataFromApi[] = data.map((user) => {
    return {
      fullName: user.user.displayname as string,
      avatar: user.user.image.versions.medium as string,
      login: user.user.login as string,
      level: user.level as number,
      promo: getPromo(user.begin_at) as number,
      campusId: campusId,
      rank: 1,
    };
  });

  const tempUsers = {
    2016: users.filter((u) => u.promo === 2016),
    2017: users.filter((u) => u.promo === 2017),
    2018: users.filter((u) => u.promo === 2018),
    2019: users.filter((u) => u.promo === 2019),
    2020: users.filter((u) => u.promo === 2020),
    2021: users.filter((u) => u.promo === 2021),
    2022: users.filter((u) => u.promo === 2022),
    2023: users.filter((u) => u.promo === 2023),
    2024: users.filter((u) => u.promo === 2024),
    2025: users.filter((u) => u.promo === 2025),
  };

  let rankedUsers: UserDataFromApi[] = [];

  for (let temp in tempUsers) {
    const yearUsers = tempUsers[temp as unknown as keyof typeof tempUsers];
    const sortedUsers = yearUsers.sort((a, b) => b.level - a.level);
    const rankedYearUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
    rankedUsers = [...rankedUsers, ...rankedYearUsers];
  }

  console.log("START DB PROCESSS");
  const { message, error } = await updateUsers(rankedUsers);
  console.log("END DB");
}
