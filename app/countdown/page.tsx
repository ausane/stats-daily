import Countdown from "@/components/countdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Page",
  description: "A page with a countdown timer.",
  openGraph: {
    title: "Countdown Page",
    description: "A page featuring a countdown timer.",
    siteName: "StatsDaily",
    images: [
      {
        url: "/countdown.png",
        width: 1600,
        height: 900,
        alt: "Countdown App Image",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Countdown Page",
    description: "A page featuring a countdown timer.",
    images: [
      {
        url: "/countdown.png",
        width: 1600,
        height: 900,
        alt: "Countdown Twitter Image",
      },
    ],
  },
};

export default function CountdownPage() {
  return <Countdown />;
}
