"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Dumbbell, Salad, MessageSquare } from "lucide-react";

const links = [
  { href: "/client", icon: LayoutDashboard, key: "dashboard" },
  { href: "/client/workouts", icon: Dumbbell, key: "myWorkouts" },
  { href: "/client/diet", icon: Salad, key: "myDiet" },
  { href: "/client/messages", icon: MessageSquare, key: "messages" },
] as const;

export function ClientSidebar() {
  const t = useTranslations("client");
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1">
        {links.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-emerald-50 text-emerald-800"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {t(key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
