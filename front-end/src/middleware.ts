import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authStorage from "@/storage/authStorage";

export async function middleware(request: NextRequest) {

  const authToken = authStorage.getToken();
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/home");

  if (isAuthRoute && !authToken) {
    // Redirect to login if accessing protected route without auth
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
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
