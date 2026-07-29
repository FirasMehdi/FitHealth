import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q") || "";

  const workouts = await db.workoutProgram.findMany({
    where: q
      ? {
          OR: [
            { nameEn: { contains: q } },
            { nameFr: { contains: q } },
            { nameAr: { contains: q } },
          ],
        }
      : undefined,
    include: { exercises: { include: { exercise: true } } },
    orderBy: { nameEn: "asc" },
  });

  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const workout = await db.workoutProgram.create({ data: body });
  return NextResponse.json(workout);
}
