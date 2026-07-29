import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedAdminPaths = ["/admin"];
const protectedClientPaths = ["/client"];
const authPaths = ["/login", "/signup"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(en|fr|ar)(\/|$)/);
  const locale = localeMatch?.[1] || "fr";
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, "") || "/";

  const sessionCookie = request.cookies.get("fithealth_session")?.value;
  const isAuthenticated = Boolean(sessionCookie);

  const isAdminRoute = protectedAdminPaths.some((p) =>
    pathWithoutLocale.startsWith(p)
  );
  const isClientRoute = protectedClientPaths.some((p) =>
    pathWithoutLocale.startsWith(p)
  );
  const isAuthRoute = authPaths.some((p) => pathWithoutLocale.startsWith(p));

  if ((isAdminRoute || isClientRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
