import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    if (!["user", "librarian"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    const db = client.db(process.env.MONGODB_DATABASE);

    const userId = session.user.id;

    const result = await db.collection("user").updateOne(
      {
        $or: [
          { id: userId },
          ...(ObjectId.isValid(userId)
            ? [{ _id: new ObjectId(userId) }]
            : []),
        ],
      },
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    console.log("ROLE UPDATE RESULT:", {
      userId,
      selectedRole: role,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("ROLE_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to save role" },
      { status: 500 }
    );
  }
}