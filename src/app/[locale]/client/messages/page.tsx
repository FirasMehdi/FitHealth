"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { PageHeader, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { role: string };
};

export default function ClientMessagesPage() {
  const t = useTranslations("client");
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/messages/client");
    const data = await res.json();
    setMessages(data.messages || []);
    setAdminId(data.adminId);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !adminId) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: adminId, content }),
    });
    setContent("");
    load();
  }

  return (
    <div>
      <PageHeader title={t("messages")} />
      <Card className="flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px]">
          {messages.map((msg) => {
            const isClient = msg.sender.role === "CLIENT";
            return (
              <div key={msg.id} className={`flex ${isClient ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isClient ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-stone-500">{t("typeMessage")}</p>
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
          <Button type="submit">{t("sendMessage")}</Button>
        </form>
      </Card>
    </div>
  );
}
