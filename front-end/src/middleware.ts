import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes, protectedRoutes,authRoutes } from "./data/routes";
import { cookies } from "next/headers";
import { decodeToken } from "./utils/userUtils";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = (await cookies()).get("access_token")?.value;
  const { userId } = cookie ? decodeToken(cookie) : {};

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL(routes.login, request.nextUrl));
  }

  if (isAuthRoute && cookie && userId) {
    return NextResponse.redirect(new URL(routes.home, request.nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
