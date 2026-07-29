import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q") || "";

  const exercises = await db.exercise.findMany({
    where: q
      ? {
          OR: [
            { nameEn: { contains: q } },
            { nameFr: { contains: q } },
            { nameAr: { contains: q } },
            { muscleGroup: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { nameEn: "asc" },
  });

  return NextResponse.json(exercises);
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const exercise = await db.exercise.create({ data: body });
  return NextResponse.json(exercise);
}
