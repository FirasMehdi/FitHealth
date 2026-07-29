"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LogoutButton() {
  const t = useTranslations("nav");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
    >
      {t("logout")}
    </button>
  );
}
