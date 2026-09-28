import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { auth } from "@/lib/auth";

const JWT_COOKIE_NAME = "bibliodrop_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function GET() {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return NextResponse.json(
        {
          message: "JWT_SECRET is not configured",
        },
        { status: 500 }
      );
    }

    // Get current Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          message: "No authenticated session found",
        },
        { status: 401 }
      );
    }

    const user = session.user;

    // Create JWT
    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email || "",
        role: user.role || "user",
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    const response = NextResponse.json({
      success: true,
      message: "JWT cookie created successfully",
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,

      httpOnly: true,

      secure: isProduction,

      sameSite: isProduction ? "none" : "lax",

      path: "/",

      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("JWT COOKIE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create JWT cookie",
      },
      { status: 500 }
    );
  }
}