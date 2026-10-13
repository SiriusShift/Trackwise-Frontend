import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => (
  <section className="py-20 lg:py-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 px-6 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start tracking your money today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Set up in a few minutes and see your month clearly from the first day.
          </p>
          <Button size="lg" className="mt-8 rounded-full px-6" asChild>
            <Link to="/sign-up">Create your account</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
