import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageHeader, Card } from "@/components/ui/Card";
import { db } from "@/lib/db";

export default async function AdminClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const auth = await getTranslations("auth");

  const clients = await db.clientProfile.findMany({
    include: { user: true },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <PageHeader title={t("manageClients")} />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-start font-medium text-stone-600">{t("name")}</th>
                <th className="px-6 py-3 text-start font-medium text-stone-600">{t("email")}</th>
                <th className="px-6 py-3 text-start font-medium text-stone-600">{t("phone")}</th>
                <th className="px-6 py-3 text-start font-medium text-stone-600">{t("goal")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-500">
                    {t("noResults")}
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-stone-900">{client.fullName}</td>
                    <td className="px-6 py-4 text-stone-600">{client.user.email}</td>
                    <td className="px-6 py-4 text-stone-600">{client.phone}</td>
                    <td className="px-6 py-4 text-stone-600">
                      {auth(`goals.${client.goal}`)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
