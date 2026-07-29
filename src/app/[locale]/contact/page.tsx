"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium text-stone-900">{t("title")}</h1>
        <p className="mt-4 text-lg text-stone-600">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          {sent ? (
            <p className="py-8 text-center text-emerald-700">{t("success")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label={t("name")} name="name" required />
              <Input label={t("email")} name="email" type="email" required />
              <Input label={t("phone")} name="phone" type="tel" required />
              <Textarea label={t("message")} name="message" required />
              <Button type="submit">{t("send")}</Button>
            </form>
          )}
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-medium text-stone-900">{t("location")}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-medium text-stone-900">{t("hours")}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
