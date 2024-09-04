import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/components/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StatsDaily",
  description: `Stats Daily is a web application designed to help users track their daily tasks, set targets, and evaluate their work performance. By visualizing their progress and statistics, users can gain insights into their productivity and make necessary changes to improve.`,
  openGraph: {
    title: "StatsDaily",
    description: "Daily Tasks Completion Tracker.",
    url: "https://stats-daily.vercel.app/",
    siteName: "StatsDaily",
    images: [
      {
        url: "/layout.png",
        width: 800,
        height: 600,
        alt: "Default OG Image",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>{children}</StoreProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
