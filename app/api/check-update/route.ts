import prisma from "@/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && /.*\.intra\..*/.test(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, origin);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const update = await prisma.update.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!update || !update.message) {
      return addCorsHeaders(
        NextResponse.json({ update: null }, { status: 200 }),
        origin
      );
    }

    return addCorsHeaders(
      NextResponse.json({ update }, { status: 200 }),
      origin
    );
  } catch (error) {
    console.error("Error fetching update:", error);
    return addCorsHeaders(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      origin
    );
  }
}
