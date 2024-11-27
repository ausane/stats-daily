"use client";

import { HeaderProps, TStats, MainContentProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { PageFooter, SDIcon } from "@/components/home-page";
import { InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { RadarChartComponent } from "./radar-chart";
import Link from "next/link";

export function StatsComponent({ data }: { data: TStats[] }) {
  const [selectedValue, setSelectedValue] = useState<string>("1");
  const [stats, setStats] = useState<TStats[]>(data);

  useEffect(() => {
    const count = parseInt(selectedValue, 10);
    setStats(data.slice(0, count));
  }, [selectedValue, data]);

  if (!stats.length) {
    return (
      <>
        <ChartHeader
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <NoStatsFound />
        <PageFooter />
      </>
    );
  }

  return (
    <>
      <ChartHeader
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
      <ChartMainContent stats={stats} selectedValue={selectedValue} />
      <PageFooter />
    </>
  );
}

// Chart Collection Component Header
export function ChartHeader({ selectedValue, setSelectedValue }: HeaderProps) {
  return (
    <header className="flex-between sticky top-0 z-40 h-16 border-b bg-background px-4 lg:px-6">
      <Link href="/" className="flex-center gap-2.5" prefetch={false}>
        <SDIcon />
        <span className="text-2xl font-bold text-foreground/90 max-sm:hidden">
          StatsDaily
        </span>
      </Link>
      <Select
        value={selectedValue}
        onValueChange={setSelectedValue}
        name="select-timeline"
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select Timeline" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Timelines</SelectLabel>
            <SelectItem value="60">Last 2 months</SelectItem>
            <SelectItem value="30">Last month</SelectItem>
            <SelectItem value="21">Last 21 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="3">Last 3 days</SelectItem>
            <SelectItem value="1">Yesterday</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </header>
  );
}

// Chart Collection Component Main Content
export function ChartMainContent({ stats, selectedValue }: MainContentProps) {
  return (
    <main className="p-4 sm:p-8">
      <RadarChartComponent stats={stats} days={selectedValue} />
    </main>
  );
}

export function NoStatsFound() {
  return (
    <div className="flex-center h-[calc(100dvh-8rem)] flex-col">
      <div className="flex items-center space-x-2">
        <InfoIcon size={24} aria-hidden="true" />
        <h1 className="text-xl font-semibold">No Stats Found!</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Please wait at least a day to get started!
      </p>
    </div>
  );
}
