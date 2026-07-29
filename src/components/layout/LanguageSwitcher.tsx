import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-1">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            locale === l.code
              ? "bg-white text-emerald-800 shadow-sm"
              : "text-stone-500 hover:text-stone-800"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
