"use client";

import { Session } from "next-auth";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function SessionProviderComponent({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
