// A word with a hand-drawn strike-through or underline that draws itself in from left to right.
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Negative insets leave room for the round caps and stroke width
const hiddenLine = "inset(-100% 100% -100% -10%)";
const shownLine = "inset(-100% -10% -100% -10%)";

const marks = {
  strike: {
    d: "M3 13 C 50 5, 110 17, 197 7",
    svg: "top-1/2 h-[0.35em] -translate-y-1/2",
    stroke: "stroke-[0.11em]",
  },
  underline: {
    d: "M3 15 Q 100 3, 197 12",
    svg: "bottom-[-0.18em] h-[0.3em]",
    stroke: "stroke-[0.14em]",
  },
};

interface ScribbledWordProps {
  children: ReactNode;
  mark: keyof typeof marks;
  /** Seconds before the line starts drawing. */
  delay: number;
  /** Stroke color, e.g. `stroke-primary`. */
  strokeClassName: string;
  className?: string;
}

const ScribbledWord = ({
  children,
  mark,
  delay,
  strokeClassName,
  className = "",
}: ScribbledWordProps) => {
  const reduceMotion = useReducedMotion();
  const { d, svg, stroke } = marks[mark];

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {/* Drawn with a clip reveal, not pathLength: with non-scaling-stroke the dash is measured
          in viewBox units, so the line stops short once the word is wider than 200px.
          Stroke widths are in em so the line keeps its weight relative to the text at every size. */}
      <motion.svg
        aria-hidden
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute inset-x-0 w-full overflow-visible ${svg}`}
        initial={reduceMotion ? false : { clipPath: hiddenLine }}
        animate={{ clipPath: shownLine }}
        transition={{ delay, duration: 0.55, ease: "easeInOut" }}
      >
        <path
          d={d}
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={`${strokeClassName} ${stroke}`}
        />
      </motion.svg>
    </span>
  );
};

export default ScribbledWord;
