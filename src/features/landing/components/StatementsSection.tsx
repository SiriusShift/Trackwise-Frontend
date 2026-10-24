import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import CreditStatementPreview from "./CreditStatementPreview";
import MoneyFlowPreview from "./MoneyFlowPreview";
import ScrollReveal from "./ScrollReveal";
import StatementPreview from "./StatementPreview";

const points = [
  "Account statements with opening and closing balances",
  "Credit card statements with the amount due and installments",
  "Money flow reports across all your cash and bank accounts",
  "Clean PDFs, ready to print, file, or share",
];

const reports = [
  { value: "account", label: "Account", preview: <StatementPreview /> },
  { value: "credit", label: "Credit card", preview: <CreditStatementPreview /> },
  { value: "flow", label: "Money flow", preview: <MoneyFlowPreview /> },
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
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 *:min-w-0">
        <ScrollReveal
          className="order-2 lg:order-1"
          fromScale={0.96}
          fromOpacity={0.3}
          fromY={24}
        >
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              {reports.map((r) => (
                <TabsTrigger key={r.value} value={r.value}>
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* All previews share one grid cell, so switching tabs never changes the height */}
            <div className="grid">
              {reports.map((r) => (
                <TabsContent
                  key={r.value}
                  value={r.value}
                  forceMount
                  className="col-start-1 row-start-1 mt-0 transition-opacity duration-300 data-[state=inactive]:invisible data-[state=inactive]:opacity-0 content-center"
                >
                  {r.preview}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </ScrollReveal>
        <div className="lg:order-2">
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
              Reports you can download
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pick an account or card and a date range, and get a clean PDF of
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
