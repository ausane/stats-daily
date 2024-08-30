/**
 * v0 by Vercel.
 * @see https://v0.dev/t/2kO1UsA91Lh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <CheckIcon />
          <span className="sr-only">
            statsDaily - Daily Tasks Completion Tracker
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-muted-foreground sm:text-5xl xl:text-6xl/none">
                    Track Your Daily Task Completion with StatsDaily
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our data-driven daily tasks completion app helps you stay
                    organized, track your progress, and achieve your goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/areas/create"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-muted px-8 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-muted bg-background px-8 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Download
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl bg-[url('/stats.webp')] bg-cover bg-center" />
                <div className="aspect-square rounded-xl bg-[url('/stats.webp')] bg-cover bg-center" />
                <div className="aspect-square rounded-xl bg-[url('/stats.webp')] bg-cover bg-center" />
                <div className="aspect-square rounded-xl bg-[url('/stats.webp')] bg-cover bg-center" />
              </div>
            </div>
          </div>
          <div className="animate-gradient-xy absolute inset-0 z-0 bg-gradient-to-r from-[#000000] to-[#000000] opacity-20" />
          <div className="animate-gradient-xy absolute inset-0 z-0 bg-[url('/stats.webp')] bg-cover bg-center opacity-10" />
        </section>
        <section className="relative flex w-full flex-col gap-8 bg-muted px-4 py-12">
          <div className="w-full space-y-2 md:w-4/5">
            <h1 className="text-3xl font-bold tracking-tighter text-muted-foreground sm:text-5xl xl:text-6xl/none">
              Easy, Understandable, user friendly UI
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Our data-driven daily tasks completion app helps you stay
              organized, track your progress, and achieve your goals.
            </p>
          </div>
          <div className="flex-center h-full w-2/5 w-full">
            <div className="relative aspect-video w-full rounded-lg bg-[url('/area.png')] bg-contain bg-center bg-no-repeat" />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Daily Task Completion
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-muted-foreground sm:text-5xl">
                  Data-Driven Daily Productivity with StatsDaily
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our app provides detailed insights into your daily task
                  completion habits, helping you optimize your workflow and
                  achieve your goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold text-muted-foreground">
                  85%
                </div>
                <div className="text-muted-foreground">
                  Daily Tasks Completed on Time
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold text-muted-foreground">
                  12.3 hrs
                </div>
                <div className="text-muted-foreground">
                  Average Daily Productivity
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold text-muted-foreground">
                  98%
                </div>
                <div className="text-muted-foreground">User Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Get Started with StatsDaily
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-muted-foreground sm:text-5xl">
                  Unlock Your Daily Productivity
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up or download our app today and start taking control of
                  your daily tasks and time.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-muted px-8 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Sign Up
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-muted bg-background px-8 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Download
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t border-muted px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 StatsDaily - Daily Tasks Completion Tracker. All rights
          reserved.
        </p>
        {/* <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav> */}
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <code className="bbn flex-center bold h-10 w-10 rounded-md border-muted text-2xl font-bold text-muted-foreground">
      SD
    </code>
  );
}
