import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageHeader, Card } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { Users, Dumbbell, Salad, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const [clients, workouts, diets, unreadMessages] = await Promise.all([
    db.clientProfile.count(),
    db.workoutProgram.count(),
    db.dietPlan.count(),
    db.message.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: t("clients"), value: clients, href: "/admin/clients", icon: Users },
    { label: t("workouts"), value: workouts, href: "/admin/workouts", icon: Dumbbell },
    { label: t("diet"), value: diets, href: "/admin/diet", icon: Salad },
    { label: t("messages"), value: unreadMessages, href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div>
      <PageHeader title={t("dashboard")} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">{label}</p>
                  <p className="mt-1 text-3xl font-semibold text-stone-900">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
