import "./globals.css";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/components/store-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  title: "StatsDaily",
  description: `Stats Daily is a web application designed to help users track their daily tasks, set targets, and evaluate their work performance. By visualizing their progress and statistics, users can gain insights into their productivity and make necessary changes to improve.`,
  openGraph: {
    title: "StatsDaily",
    description: "Daily Tasks Completion Tracker",
    url: new URL(process.env.METADATA_BASE_URL as string),
    siteName: "StatsDaily",
    images: [
      {
        url: "/layout.png",
        width: 1600,
        height: 900,
        alt: "StatsDaily OpenGraph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "StatsDaily",
    description: "Daily Tasks Completion Tracker",
    images: [
      {
        url: "/layout.png",
        width: 1600,
        height: 900,
        alt: "StatsDaily Twitter Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>{children}</StoreProvider>
          </ThemeProvider>
        </StackProvider>
      </body>
    </html>
  );
}
