import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeConfig, isProtectedRoute, isAuthRoute } from "./data/routes";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAuth = isAuthRoute(path);
  const isProtected = isProtectedRoute(path);

  if (!isAuth && !isProtected) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const initialHasToken = Boolean(refreshToken || accessToken);

  if (isProtected && !initialHasToken) {
    const loginUrl = new URL(routeConfig.protected.redirectTo, request.nextUrl);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && refreshToken && !accessToken) {
    return NextResponse.next();
  }

  if (isAuth && initialHasToken) {
    const from = request.nextUrl.searchParams.get("from");
    const redirectUrl =
      from && !isAuthRoute(from) ? from : routeConfig.auth.redirectTo;
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
