// Small tilted card that floats over a screenshot, pops in once in view and drifts with scroll.
// Decorative: render inside an aria-hidden wrapper, since the screenshot's alt text carries the meaning.
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Parallax from "./Parallax";

export interface FloatingCardProps {
  icon: LucideIcon;
  tone: string;
  title: string;
  detail: string;
  /** Right-aligned value, such as a scheduled amount. */
  amount?: string;
  amountTone?: string;
  /** Tiny pill under the amount, such as "Auto". */
  badge?: string;
  rotate: number;
  delay: number;
  /** Parallax travel, varied per card so they drift apart while scrolling. */
  distance: number;
  className: string;
}

const FloatingCard = ({
  icon: Icon,
  tone,
  title,
  detail,
  amount,
  amountTone = "",
  badge,
  rotate,
  delay,
  distance,
  className,
}: FloatingCardProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <Parallax distance={distance} className={`absolute z-10 ${className}`}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", bounce: 0.35, duration: 0.7 }}
        className="flex w-max items-center gap-2 rounded-xl border border-border bg-card/90 px-2.5 py-2 text-left shadow-xl shadow-primary/10 backdrop-blur"
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-semibold leading-tight">
          {title}
          <span className="block text-[9px] font-normal text-muted-foreground">
            {detail}
          </span>
        </span>
        {amount && (
          <span className="ml-2 text-right text-[11px] font-bold leading-tight">
            <span className={amountTone}>{amount}</span>
            {badge && (
              <span className="mt-0.5 block w-fit rounded-full border border-border px-1.5 text-[8px] font-medium text-muted-foreground ml-auto">
                {badge}
              </span>
            )}
          </span>
        )}
      </motion.div>
    </Parallax>
  );
};

export default FloatingCard;
