"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const goals = ["MAINTAIN", "LOSS", "GAIN"] as const;
const activityLevels = [
  "SEDENTARY",
  "LIGHT",
  "MODERATE",
  "ACTIVE",
  "VERY_ACTIVE",
] as const;

export default function SignupPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
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
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <Card>
        <h1 className="font-display text-2xl font-medium text-stone-900">{t("signupTitle")}</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label={t("fullName")} name="fullName" required />
          </div>
          <Input label={t("email")} name="email" type="email" required className="sm:col-span-2" />
          <Input label={t("password")} name="password" type="password" required />
          <Input label={t("confirmPassword")} name="confirmPassword" type="password" required />
          <Input label={t("dateOfBirth")} name="dateOfBirth" type="date" required />
          <Input label={t("placeOfBirth")} name="placeOfBirth" required />
          <Input label={t("phone")} name="phone" type="tel" required />
          <Input label={t("weight")} name="weight" type="number" step="0.1" required />
          <Input label={t("height")} name="height" type="number" step="0.1" required />
          <Select label={t("goal")} name="goal" required defaultValue="MAINTAIN">
            {goals.map((g) => (
              <option key={g} value={g}>
                {t(`goals.${g}`)}
              </option>
            ))}
          </Select>
          <Select label={t("activityLevel")} name="activityLevel" required defaultValue="MODERATE">
            {activityLevels.map((a) => (
              <option key={a} value={a}>
                {t(`activityLevels.${a}`)}
              </option>
            ))}
          </Select>
          {error && (
            <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
          )}
          <Button type="submit" className="sm:col-span-2 w-full" disabled={loading}>
            {loading ? "..." : t("signupButton")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-600">
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-emerald-700 hover:underline">
            {t("loginButton")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
