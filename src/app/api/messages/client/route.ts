import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["CLIENT"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    return NextResponse.json({ messages: [], adminId: null });
  }

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: admin.id },
        { senderId: admin.id, receiverId: session.id },
      ],
    },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  await db.message.updateMany({
    where: { senderId: admin.id, receiverId: session.id, read: false },
    data: { read: true },
  });

  return NextResponse.json({ messages, adminId: admin.id });
}
