import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageHeader, Card } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Dumbbell, Salad } from "lucide-react";

export default async function ClientDashboard({
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
      workoutAssignments: { include: { program: true } },
      dietAssignments: { include: { dietPlan: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title={t("dashboard")}
        subtitle={`${t("welcome")}, ${profile?.fullName || session.fullName}`}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/client/workouts">
          <Card className="transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{t("myWorkouts")}</p>
                <p className="text-sm text-stone-500">
                  {profile?.workoutAssignments.length || 0} assigned
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/client/diet">
          <Card className="transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Salad className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{t("myDiet")}</p>
                <p className="text-sm text-stone-500">
                  {profile?.dietAssignments.length || 0} assigned
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
