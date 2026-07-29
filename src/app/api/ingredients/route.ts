import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q") || "";

  const ingredients = await db.ingredient.findMany({
    where: q
      ? {
          OR: [
            { nameEn: { contains: q } },
            { nameFr: { contains: q } },
            { nameAr: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { nameEn: "asc" },
  });

  return NextResponse.json(ingredients);
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const ingredient = await db.ingredient.create({ data: body });
  return NextResponse.json(ingredient);
}
