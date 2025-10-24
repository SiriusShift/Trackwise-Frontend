import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export default function AnimateNumber({ value, duration, ...props }: {value: number; duration: number;}) {
  const count = useMotionValue(0);

  // Format with commas + 2 decimals
  const formatted = useTransform(count, (latest) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(latest)
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.span {...props} className="text-3xl font-sans">
      {formatted}
    </motion.span>
  );
}
