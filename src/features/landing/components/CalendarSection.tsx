import CalendarDark from "@/assets/images/calendar-dark.webp";
import CalendarLight from "@/assets/images/calendar-light.webp";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useIsDark } from "@/shared/hooks/useIsDark";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { BriefcaseBusiness, Check, CreditCard, Tv } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Laptop } from "./DeviceFrames";
import FloatingCard, { type FloatingCardProps } from "./FloatingCard";
import ScrollReveal from "./ScrollReveal";

const points = [
  "Bills, subscriptions, and paychecks scheduled automatically",
  "Credit card due dates added from each statement",
  "Installments placed on the right month until they are paid off",
  "Email reminders before anything is due",
];

// Sample entries matching the calendar screenshot. They zigzag right, left, right, each placed
// over an empty part of the month so the scheduled events in the screenshot stay visible.
const scheduled: FloatingCardProps[] = [
  {
    icon: BriefcaseBusiness,
    tone: "bg-success/15 text-success",
    title: "Salary - 15th",
    detail: "Nov 15 · Salary",
    amount: `+${formatCurrency(27500)}`,
    amountTone: "text-success",
    badge: "Auto",
    rotate: 4,
    delay: 0.3,
    distance: 30,
    // Week 1, Fri–Sat (empty). Phones keep it inside the gutter: the section doesn't clip overflow
    className: "right-0 top-[14%] sm:-right-4",
  },
  {
    icon: CreditCard,
    tone: "bg-primary/15 text-primary",
    title: "Credit card bill",
    detail: "Nov 15 · Credit card",
    amount: formatCurrency(25793),
    rotate: -5,
    delay: 0.45,
    distance: 50,
    // Week 4, Sun–Mon (empty). Hidden on phones so the cards don't cover most of the calendar
    className: "-left-3 top-[60%] max-sm:hidden lg:-left-6",
  },
  {
    icon: Tv,
    tone: "bg-destructive/15 text-destructive",
    title: "Netflix Premium",
    detail: "Nov 20 · Subscription",
    amount: `−${formatCurrency(549)}`,
    amountTone: "text-destructive",
    badge: "Auto",
    rotate: -3,
    delay: 0.6,
    distance: 40,
    // Week 5's greyed next-month days on the right; bottom-left on phones so the two visible cards zigzag
    className: "bottom-[6%] left-0 sm:left-auto sm:right-[4%]",
  },
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

const CalendarSection = () => {
  const isDark = useIsDark();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section
      id="calendar"
      className="scroll-mt-16 border-b border-border/60 bg-card/30 py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 *:min-w-0">
        <div>
          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, ...(isMobile ? { y: 16 } : { x: -32 }) }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Every due date, in one calendar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Scheduled transactions and credit card dues land on the same
              calendar, so you can see the month ahead at a glance.
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
        <ScrollReveal
          className="relative"
          fromScale={0.96}
          fromOpacity={0.3}
          fromY={24}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-4xl bg-primary/10 blur-3xl"
          />
          {/* 88% wide so the laptop base's 6% overhang stays inside the column on phones */}
          <div className="mx-auto w-[88%]">
            <Laptop>
              {/* Cropped to the month grid (x 245–1520, y 60–857 of 1794×857), which is exactly 16:10: drops the
                  app sidebar, the Scheduled list and the top bar with the signed-in user's name */}
              <img
                src={isDark ? CalendarDark : CalendarLight}
                alt="Trackwise calendar for November showing rent, subscriptions, paydays and a credit card bill"
                loading="lazy"
                className="max-w-none"
                style={{
                  width: "140.71%",
                  marginLeft: "-19.22%",
                  marginTop: "-4.71%",
                }}
              />
            </Laptop>
          </div>
          {/* Stand-ins for the Scheduled list the crop removes */}
          <div aria-hidden>
            {scheduled.map((s) => (
              <FloatingCard key={s.title} {...s} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CalendarSection;
