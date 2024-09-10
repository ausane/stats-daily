import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();

  const rp = request.nextUrl.pathname.slice(1);
  if (!user) {
    return NextResponse.redirect(
      new URL(`/sign-in?after_auth_return_to=%2F${rp}`, request.url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/areas/:areaId", "/stats"],
};
