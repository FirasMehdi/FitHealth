import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageHeader, Card } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { localizedField } from "@/lib/utils";

export default async function ClientWorkoutsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("client");

  const session = await getSession();
  if (!session) return null;

  const profile = await db.clientProfile.findUnique({
    where: { userId: session.id },
    include: {
      workoutAssignments: {
        include: {
          program: {
            include: {
              exercises: {
                include: { exercise: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  const assignments = profile?.workoutAssignments || [];

  return (
    <div>
      <PageHeader title={t("myWorkouts")} />
      {assignments.length === 0 ? (
        <Card>
          <p className="text-stone-500">{t("noWorkouts")}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {assignments.map(({ program }) => (
            <Card key={program.id}>
              <h3 className="text-lg font-semibold text-stone-900">
                {localizedField(program, "name", locale)}
              </h3>
              {program.descriptionEn && (
                <p className="mt-2 text-sm text-stone-600">
                  {localizedField(program, "description", locale)}
                </p>
              )}
              <div className="mt-6 space-y-3">
                {program.exercises.map((we, i) => (
                  <div
                    key={we.id}
                    className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-stone-800">
                      {i + 1}. {localizedField(we.exercise, "name", locale)}
                    </span>
                    <span className="text-stone-500">
                      {we.sets} {t("sets")} × {we.reps} {t("reps")}
                      {we.restSeconds ? ` · ${we.restSeconds}s ${t("rest")}` : ""}
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
