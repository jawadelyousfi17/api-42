import prisma from "@/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && /.*\.intra\..*/.test(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
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
  const searchParams = request.nextUrl.searchParams;
  const login = searchParams.get("login");
  const authHeader = request.headers.get("Authorization");

  if (!login) {
    return addCorsHeaders(
      NextResponse.json({ error: "Missing login parameter" }, { status: 400 }),
      origin
    );
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return addCorsHeaders(
      NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      ),
      origin
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token with 42 API
    const response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return addCorsHeaders(
        NextResponse.json({ error: "Invalid token" }, { status: 401 }),
        origin
      );
    }

    const userData = await response.json();

    // Verify that the token belongs to the requested user
    if (userData.login !== login) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Token does not match the provided login" },
          { status: 403 }
        ),
        origin
      );
    }

    // Fetch user preferences from database
    const intraUser = await prisma.intraUser.findUnique({
      where: { login },
      include: {
        preferences: true,
      },
    });

    if (!intraUser) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        ),
        origin
      );
    }

    // Return the preferences (assuming we want the first one if multiple, or the whole array)
    // Based on the schema, it's a one-to-many but logically seems like 1-to-1 or 1-active.
    // The form uses preferences[0], so we'll return that or the array.
    // Let's return the array to be safe, or the object if it's just one.
    // The user asked for "the intra user preferences".

    return addCorsHeaders(
      NextResponse.json(intraUser.preferences[0] || {}),
      origin
    );
  } catch (error) {
    console.error("Error in preferences API:", error);
    return addCorsHeaders(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      origin
    );
  }
}
