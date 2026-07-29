import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hero");
  const offers = await getTranslations("offers");

  const plans = ["starter", "premium", "elite"] as const;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#d1fae5_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-800">
              {t("badge")}
            </span>
            <h1 className="font-display mt-6 text-5xl font-medium leading-tight tracking-tight text-stone-900 sm:text-6xl">
              {t("title")}{" "}
              <span className="text-emerald-700">{t("coach")}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-600">{t("subtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/signup" size="lg">
                {t("ctaPrimary")}
              </ButtonLink>
              <ButtonLink href="#offers" variant="secondary" size="lg">
                {t("ctaSecondary")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section id="offers" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-medium text-stone-900 sm:text-4xl">
            {offers("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">{offers("subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const features = offers.raw(`${plan}.features`) as string[];
            const isPopular = plan === "premium";

            return (
              <Card
                key={plan}
                className={`relative flex flex-col ${isPopular ? "border-emerald-300 ring-2 ring-emerald-600/10" : ""}`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-700 px-4 py-1 text-xs font-medium text-white">
                    {offers("popular")}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-stone-900">
                    {offers(`${plan}.name`)}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-stone-900">
                      {offers(`${plan}.price`)}
                    </span>
                    <span className="text-stone-500">{offers(`${plan}.period`)}</span>
                  </div>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-stone-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/signup"
                  variant={isPopular ? "primary" : "secondary"}
                  className="w-full text-center"
                >
                  {t("ctaPrimary")}
                </ButtonLink>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
