import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      confirmPassword,
      fullName,
      dateOfBirth,
      placeOfBirth,
      phone,
      weight,
      height,
      goal,
      activityLevel,
    } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "passwordMismatch" }, { status: 400 });
    }

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "emailExists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        role: "CLIENT",
        clientProfile: {
          create: {
            fullName,
            dateOfBirth: new Date(dateOfBirth),
            placeOfBirth,
            phone,
            weight: parseFloat(weight),
            height: parseFloat(height),
            goal,
            activityLevel,
          },
        },
      },
      include: { clientProfile: true },
    });

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.clientProfile?.fullName,
    });

    return NextResponse.json({ redirect: "/client" });
  } catch {
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
