import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, dietPlanId } = await request.json();

  const assignment = await db.dietAssignment.upsert({
    where: { clientId_dietPlanId: { clientId, dietPlanId } },
    create: { clientId, dietPlanId },
    update: { assignedAt: new Date() },
  });

  return NextResponse.json(assignment);
}
