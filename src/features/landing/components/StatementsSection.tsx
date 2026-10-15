import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import StatementPreview from "./StatementPreview";

const points = [
  "Opening and closing balance for the period",
  "Every credit and debit, with descriptions",
  "Per-account statements, generated in seconds",
  "Ready to print, file, or share",
];

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const point = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, bounce: 0, duration: 0.6 },
  },
};

const check = {
  hidden: { scale: 0.6 },
  show: {
    scale: 1,
    transition: { type: "spring" as const, bounce: 0.3, duration: 0.5 },
  },
};

const StatementsSection = () => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section
      id="statements"
      className="scroll-mt-16 border-b border-border/60 bg-card/30 py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 *:min-w-0">
        <StatementPreview />
        <div>
          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, ...(isMobile ? { y: 16 } : { x: 32 }) }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Statements you can download
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pick an account and a date range, and get a clean PDF statement of
              everything that moved in and out.
            </p>
          </motion.div>
          <motion.ul
            variants={list}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-6 space-y-3"
          >
            {points.map((text) => (
              <motion.li
                key={text}
                variants={point}
                className="flex items-start gap-3 text-sm"
              >
                <motion.span
                  variants={check}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default StatementsSection;
