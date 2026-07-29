import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.clientProfile.findMany({
    include: { user: true },
  });

  const conversations = await Promise.all(
    clients.map(async (client) => {
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: client.userId },
            { receiverId: client.userId },
          ],
        },
        include: {
          sender: { include: { clientProfile: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      return {
        clientId: client.userId,
        clientName: client.fullName,
        messages,
      };
    })
  );

  return NextResponse.json(conversations.filter((c) => c.messages.length > 0));
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["ADMIN", "CLIENT"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { receiverId, content } = await request.json();

  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const message = await db.message.create({
    data: {
      senderId: session.id,
      receiverId,
      content: content.trim(),
    },
    include: { sender: { include: { clientProfile: true } } },
  });

  return NextResponse.json(message);
}
