"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { PageHeader, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { clientProfile?: { fullName: string } | null; email: string; role: string };
};

type Conversation = {
  clientId: string;
  clientName: string;
  messages: Message[];
};

export default function AdminMessagesPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("client");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setConversations(data);
    if (!activeClient && data.length > 0) {
      setActiveClient(data[0].clientId);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeClient]);

  const active = conversations.find((c) => c.clientId === activeClient);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !activeClient) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeClient, content }),
    });
    setContent("");
    load();
  }

  return (
    <div>
      <PageHeader title={t("messages")} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-0 lg:col-span-1">
          <div className="divide-y divide-stone-100">
            {conversations.map((conv) => (
              <button
                key={conv.clientId}
                onClick={() => setActiveClient(conv.clientId)}
                className={`w-full px-4 py-3 text-start text-sm transition-colors hover:bg-stone-50 ${
                  activeClient === conv.clientId ? "bg-emerald-50 text-emerald-800" : "text-stone-700"
                }`}
              >
                {conv.clientName}
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-stone-500">{t("noResults")}</p>
            )}
          </div>
        </Card>

        <Card className="flex flex-col lg:col-span-2">
          {active ? (
            <>
              <div className="mb-4 border-b border-stone-100 pb-3 font-medium text-stone-900">
                {active.clientName}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                {active.messages.map((msg) => {
                  const isAdmin = msg.sender.role === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                          isAdmin
                            ? "bg-emerald-700 text-white"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={tc("typeMessage")}
                  className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
                <Button type="submit">{tc("sendMessage")}</Button>
              </form>
            </>
          ) : (
            <p className="py-12 text-center text-stone-500">{t("noResults")}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
