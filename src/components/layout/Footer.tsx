import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Dumbbell } from "lucide-react";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white">
                <Dumbbell className="h-3.5 w-3.5" />
              </span>
              FitHealth
            </div>
            <p className="mt-3 max-w-sm text-sm text-stone-600">{t("tagline")}</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-stone-900">{nav("home")}</p>
              <Link href="/" className="block text-stone-600 hover:text-emerald-700">
                {nav("home")}
              </Link>
              <Link href="/about" className="block text-stone-600 hover:text-emerald-700">
                {nav("about")}
              </Link>
              <Link href="/contact" className="block text-stone-600 hover:text-emerald-700">
                {nav("contact")}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} FitHealth · Zou the Doctor. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
