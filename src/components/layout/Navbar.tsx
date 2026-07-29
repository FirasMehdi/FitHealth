"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { Dumbbell } from "lucide-react";

type NavbarProps = {
  session?: { role: "ADMIN" | "CLIENT"; fullName?: string } | null;
};

export function Navbar({ session }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const dashboardHref =
    session?.role === "ADMIN" ? "/admin" : session?.role === "CLIENT" ? "/client" : null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white">
            <Dumbbell className="h-4 w-4" />
          </span>
          <span>FitHealth</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-700",
                pathname === link.href ? "text-emerald-700" : "text-stone-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {session ? (
            <>
              {dashboardHref && (
                <Link
                  href={dashboardHref}
                  className="hidden text-sm font-medium text-stone-700 hover:text-emerald-700 sm:block"
                >
                  {t("dashboard")}
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-stone-700 hover:text-emerald-700 sm:block"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
