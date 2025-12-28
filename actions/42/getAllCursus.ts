"use server";

import { CursusUser } from "@/types/42-cursu";

async function fetchEndPoint(token: string, page: number, campusId: number) {
  try {
    const API_END_POINT = `https://api.intra.42.fr/v2/cursus_users?filter[campus_id]=${campusId}&page[size]=100&sort=-level&page=${page}&filter[active]=true`;

    const response = await fetch(API_END_POINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function getAllUsers(token: string, campusId: number) {
  const data = [];
  let page = 0;
  while (true) {
    try {
      console.log("page = ", page);
      const res = await fetchEndPoint(token, page, campusId);
      if (res && res.length > 0) page++;
      if (res && res.length === 0) break;
      data.push(
        ...res.filter(
          (r: any) => r["grade"] === "Cadet" || r["grade"] === "Transcender"
        )
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return data as CursusUser[];
}
