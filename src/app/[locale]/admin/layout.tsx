import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { setRequestLocale } from "next-intl/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect({ href: "/login", locale });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
