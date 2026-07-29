"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(t(`errors.${data.error}` as "errors.generic"));
      return;
    }

    router.push(data.redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md px-4 py-16 sm:py-24">
      <Card className="w-full">
        <h1 className="font-display text-2xl font-medium text-stone-900">{t("loginTitle")}</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input label={t("email")} name="email" type="email" required />
          <Input label={t("password")} name="password" type="password" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : t("loginButton")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-600">
          {t("noAccount")}{" "}
          <Link href="/signup" className="font-medium text-emerald-700 hover:underline">
            {t("signupButton")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
