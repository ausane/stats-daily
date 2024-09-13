import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.pathname;

  // Route types
  const publicRoutes = ["/"];
  const authRoutes = ["/sign-in"];

  // Requested route type
  const isPublicRoute = publicRoutes.includes(url);
  const isAuthRoute = authRoutes.some((route) => url.startsWith(route));

  // Return next to api auth routes
  if (url.startsWith("/api/auth")) return NextResponse.next();

  // Redirect unauthenticated users trying to access protected routes
  if (!token && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL(`/sign-in?callbackUrl=${url}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
