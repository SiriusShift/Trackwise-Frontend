import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Scale at the moment the element starts entering the viewport. */
  fromScale?: number;
  /** Opacity at the moment the element starts entering the viewport. */
  fromOpacity?: number;
  /** Vertical offset in px at the start; settles to 0. */
  fromY?: number;
}

/**
 * Scales, fades and lifts its children into place as they scroll into view.
 * Fully settled once the element reaches the middle of the viewport.
 * Renders statically when the user prefers reduced motion.
 */
const ScrollReveal = ({
  children,
  className,
  fromScale = 0.92,
  fromOpacity = 0.6,
  fromY = 40,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [fromOpacity, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [fromY, 0]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { scale, opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
