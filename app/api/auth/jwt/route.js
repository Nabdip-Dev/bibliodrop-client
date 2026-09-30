import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function GET() {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT_SECRET is not configured" },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "No authenticated session found" },
        { status: 401 }
      );
    }

    const user = session.user;

    // Short-lived bootstrap token.
    // This token will be exchanged by the Render server
    // for the actual HttpOnly JWT cookie.
    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email || "",
        role: user.role || "user",
        purpose: "jwt-bootstrap",
      },
      JWT_SECRET,
      {
        expiresIn: "60s",
        issuer: "bibliodrop-web",
        audience: "bibliodrop-backend",
      }
    );

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("JWT BOOTSTRAP ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to create JWT bootstrap token",
      },
      { status: 500 }
    );
  }
}