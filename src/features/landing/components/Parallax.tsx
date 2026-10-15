import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type UseScrollOptions,
  useTransform,
} from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  /** Total vertical travel in px across the element's pass through the viewport. Negative moves up. */
  distance?: number;
  className?: string;
  offset?: UseScrollOptions["offset"];
}

/**
 * Shifts its children vertically as the page scrolls. Only animates
 * transform, and does nothing when the user prefers reduced motion.
 */
const Parallax = ({
  children,
  distance = 60,
  className,
  offset,
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset ?? ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [distance / 2, -distance / 2],
  );

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Parallax;
