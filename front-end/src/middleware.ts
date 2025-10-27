import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  routeConfig,
  isProtectedRoute,
  isAuthRoute,
} from "./data/routes";
import { cookies } from "next/headers";
import { decodeToken } from "./utils/userUtils";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAuth = isAuthRoute(path);
  const isProtected = isProtectedRoute(path);

  if (!isAuth && !isProtected) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let userId: string | undefined;

  if (token) {
    try {
      const decoded = decodeToken(token);
      userId = decoded.userId;
    } catch (error) {
      // Invalid token - clear it and redirect to login
      console.error("Invalid token:", error);
      const response = NextResponse.redirect(
        new URL(routeConfig.protected.redirectTo, request.nextUrl)
      );
      response.cookies.delete("access_token");
      return response;
    }
  }

  const isAuthenticated = Boolean(token && userId);

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(routeConfig.protected.redirectTo, request.nextUrl);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isAuthenticated) {
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
