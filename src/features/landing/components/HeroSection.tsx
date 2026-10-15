import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardImageLight from "@/assets/images/Dashboard-light.jpeg";
import DashboardImageDark from "@/assets/images/Dashboard-dark.jpeg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Grid texture with a primary glow behind the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Personal finance tracker
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Stop guessing. Start tracking.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            One place for every expense, income, and transfer. Automate the
            repeats, export the receipts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full px-6" asChild>
              <Link to="/sign-up">
                Create your account
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-6"
              asChild
            >
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl"
          />
          <img
            src={DashboardImageLight}
            alt="Trackwise dashboard showing expenses, income, and balances"
            className="w-full rounded-xl border border-border shadow-2xl shadow-primary/10 dark:hidden"
          />
          <img
            src={DashboardImageDark}
            alt="Trackwise dashboard showing expenses, income, and balances"
            className="hidden w-full rounded-xl border border-border shadow-2xl shadow-primary/10 dark:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-b-xl bg-gradient-to-t from-background to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
