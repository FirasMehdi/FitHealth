import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Heart, FlaskConical, Target } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = [
    { icon: Target, title: t("value1Title"), desc: t("value1Desc") },
    { icon: FlaskConical, title: t("value2Title"), desc: t("value2Desc") },
    { icon: Heart, title: t("value3Title"), desc: t("value3Desc") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-medium text-stone-900 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-stone-600">{t("subtitle")}</p>
        <div className="mt-10 space-y-6 text-stone-600 leading-relaxed">
          <p>{t("bio1")}</p>
          <p>{t("bio2")}</p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-2xl font-medium text-stone-900">{t("valuesTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
