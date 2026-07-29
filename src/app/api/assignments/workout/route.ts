import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, programId } = await request.json();

  const assignment = await db.workoutAssignment.upsert({
    where: { clientId_programId: { clientId, programId } },
    create: { clientId, programId },
    update: { assignedAt: new Date() },
  });

  return NextResponse.json(assignment);
}
