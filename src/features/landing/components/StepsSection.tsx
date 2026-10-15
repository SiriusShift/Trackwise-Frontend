import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Card } from "@/shared/components/ui/card";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    title: "Add your accounts",
    desc: "Add bank accounts, e-wallets, and cash with their starting balances.",
  },
  {
    title: "Record or schedule",
    desc: "Log transactions as they happen, or schedule the ones that repeat.",
  },
  {
    title: "Review your month",
    desc: "Check the dashboard, budgets, and reports to see how the month went.",
  },
];

interface StepDotProps {
  progress: MotionValue<number>;
  /** Position along the line (0–1) at which the dot lights up. */
  at: number;
  reduceMotion: boolean;
}

const StepDot = ({ progress, at, reduceMotion }: StepDotProps) => {
  const lit = useTransform(progress, [at - 0.04, at], [0, 1]);
  const scale = useTransform(progress, [at - 0.04, at, at + 0.08], [1, 1.5, 1]);

  return (
    <span
      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border"
      style={{ left: `${at * 100}%` }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-primary"
        style={reduceMotion ? undefined : { opacity: lit, scale }}
      />
    </span>
  );
};

const StepsSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Line fills as the grid moves from the lower part of the screen to the middle
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 85%", "start 35%"],
  });

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-b border-border/60 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Set up in three steps
        </h2>

        <div ref={gridRef}>
          {/* Connector line: one dot above the center of each card */}
          <div
            aria-hidden
            className="relative mt-10 hidden h-3 md:block"
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            <motion.div
              className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-primary"
              style={reduceMotion ? undefined : { scaleX: scrollYProgress }}
            />
            {[1 / 6, 1 / 2, 5 / 6].map((at) => (
              <StepDot
                key={at}
                at={at}
                progress={scrollYProgress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(({ title, desc }, i) => (
              <ScrollReveal
                key={title}
                className="h-full"
                fromScale={0.96}
                fromOpacity={0.3}
                fromY={24}
              >
                <Card className="h-full p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
