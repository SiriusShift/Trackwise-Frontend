import DashboardImageDark from "@/assets/images/Dashboard-dark.webp";
import DashboardImageLight from "@/assets/images/Dashboard-light.webp";
import { Button } from "@/shared/components/ui/button";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useTheme } from "@/shared/provider/ThemeProvider";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import HeroPhone from "./HeroPhone";
import Parallax from "./Parallax";
import ScribbledWord from "./ScribbledWord";
import ScrollReveal from "./ScrollReveal";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, bounce: 0, duration: 0.7 },
  },
};

const HeroSection = () => {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  // Same resolution as ThemeProvider, which sets the `dark` class on <html>
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  // Below Tailwind's `sm` breakpoint the desktop screenshot is unreadable, so a phone mockup replaces it
  const isPhone = useMediaQuery("(max-width: 639px)");

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <Parallax
        className="pointer-events-none absolute inset-0"
        distance={-250}
        offset={["start start", "end start"]}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pb-16 lg:pt-28">
        <motion.div
          variants={container}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Personal finance tracker
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Stop{" "}
            <ScribbledWord
              mark="strike"
              delay={0.7}
              strokeClassName="stroke-red-600"
            >
              {/* Fades with opacity, not color, so it works in every theme; only the text dims, not the line */}
              <motion.span
                initial={reduceMotion ? false : { opacity: 1 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 0.7, duration: 0.5, ease: "easeInOut" }}
              >
                guessing
              </motion.span>
            </ScribbledWord>
            . Start{" "}
            <ScribbledWord
              mark="underline"
              delay={1.25}
              className="text-primary"
              strokeClassName="stroke-primary"
            >
              tracking
            </ScribbledWord>
            .
          </motion.h1>
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground"
          >
            One place for every expense, income, and transfer. Automate the
            repeats, export the receipts.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
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
          </motion.div>
        </motion.div>

        <ScrollReveal className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl"
          />
          {/* Rendered conditionally rather than hidden with CSS, so phones never download the screenshot
              and desktops download only the one matching the theme */}
          {isPhone ? (
            <HeroPhone isDark={isDark} />
          ) : (
            <img
              src={isDark ? DashboardImageDark : DashboardImageLight}
              alt="Trackwise dashboard showing expenses, income, and balances"
              className="w-full rounded-xl border border-border shadow-2xl shadow-primary/10"
            />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-b-xl bg-gradient-to-t from-background to-transparent"
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
