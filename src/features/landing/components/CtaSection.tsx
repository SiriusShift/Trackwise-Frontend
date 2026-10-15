import { Button } from "@/shared/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import Parallax from "./Parallax";

const CtaSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", bounce: 0, duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 px-6 py-14 text-center"
        >
          <Parallax className="pointer-events-none absolute inset-0" distance={-80}>
            <div
              aria-hidden
              className="absolute -bottom-32 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
            />
          </Parallax>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start tracking your money today
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Set up in a few minutes and see your month clearly from the first
              day.
            </p>
            <motion.div
              className="mt-8 inline-block"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              <Button size="lg" className="rounded-full px-6" asChild>
                <Link to="/sign-up">Create your account</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
