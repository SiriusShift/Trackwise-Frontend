import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScreenshotPlaceholder from "./ScreenshotPlaceholder";

const HeroSection = () => (
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

    <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Personal finance tracker
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Know where your money goes, every month.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
          Track expenses, income, and transfers in one place. Schedule recurring
          transactions and keep your credit card billing under control.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="rounded-full px-6" asChild>
            <Link to="/sign-up">
              Create your account
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
            <Link to="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>

      <ScreenshotPlaceholder
        label="Dashboard screenshot"
        hint="Replace with a real capture of the Dashboard at 1280 px wide"
      />
    </div>
  </section>
);

export default HeroSection;
