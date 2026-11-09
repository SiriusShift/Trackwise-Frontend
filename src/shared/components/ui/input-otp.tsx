import { cn } from "@/lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const snap = { type: "spring", stiffness: 1218, damping: 70 } as const;
const ui = { type: "spring", stiffness: 305, damping: 33 } as const;

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-disabled:opacity-50 group",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 group-has-[[aria-invalid=true]]:motion-safe:animate-shake",
      className,
    )}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    index: number;
    mode?: "sync" | "wait" | "popLayout";
  }
>(({ index, className, mode = "popLayout", ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-input text-sm transition-all rounded-md border group-has-[[aria-invalid=true]]:ring-destructive group-has-[[aria-invalid=true]]:ring-2",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      <AnimatePresence mode={mode}>
        {char && (
          <motion.span
            key={char}
            variants={{
              enter: () => ({
                y: 18 * 1,
                opacity: 0,
                filter: "blur(2px)",
              }),
              center: { y: 0, opacity: 1, filter: "blur(0px)" },
              exit: () => ({
                y: -18 * -1,
                opacity: 0,
                filter: "blur(2px)",
                transition: { ...snap, opacity: { duration: 0.2 } },
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={ui}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
