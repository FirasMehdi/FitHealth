import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageHeader, Card } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { localizedField } from "@/lib/utils";

export default async function ClientDietPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");
  const tc = await getTranslations("common");

  const session = await getSession();
  if (!session) return null;

  const profile = await db.clientProfile.findUnique({
    where: { userId: session.id },
    include: {
      dietAssignments: {
        include: {
          dietPlan: {
            include: {
              ingredients: { include: { ingredient: true } },
            },
          },
        },
      },
    },
  });

  const assignments = profile?.dietAssignments || [];

  return (
    <div>
      <PageHeader title={t("myDiet")} />
      {assignments.length === 0 ? (
        <Card>
          <p className="text-stone-500">{t("noDiet")}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {assignments.map(({ dietPlan }) => (
            <Card key={dietPlan.id}>
              <h3 className="text-lg font-semibold text-stone-900">
                {localizedField(dietPlan, "name", locale)}
              </h3>
              <div className="mt-6 space-y-3">
                {dietPlan.ingredients.map((di) => (
                  <div
                    key={di.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <span className="font-medium text-stone-800">
                        {localizedField(di.ingredient, "name", locale)}
                      </span>
                      <span className="ms-2 text-stone-500">
                        — {t("meal")}: {di.mealType}
                      </span>
                    </div>
                    <span className="text-stone-500">
                      {di.quantity} {di.ingredient.unit} · {di.ingredient.calories * di.quantity} kcal
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
