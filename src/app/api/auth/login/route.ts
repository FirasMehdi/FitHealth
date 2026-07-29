import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { clientProfile: true },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "invalidCredentials" }, { status: 401 });
    }

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.clientProfile?.fullName,
    });

    return NextResponse.json({
      role: user.role,
      redirect: user.role === "ADMIN" ? "/admin" : "/client",
    });
  } catch {
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
