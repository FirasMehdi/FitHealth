import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.clientProfile.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  return NextResponse.json(clients);
}
