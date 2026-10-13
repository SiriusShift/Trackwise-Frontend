import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { X } from "lucide-react";
import type { TooltipRenderProps } from "react-joyride";

const TourTooltip = ({
  step,
  index,
  size,
  isLastStep,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) => (
  <Card
    {...tooltipProps}
    className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border-border/60 p-5 shadow-lg space-y-3"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Step {index + 1} of {size}
        </p>
        {step.title && <h3 className="font-semibold leading-tight">{step.title}</h3>}
      </div>
      <Button
        {...closeProps}
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>

    <div className="text-sm text-muted-foreground">{step.content}</div>

    {/* Progress dots */}
    <div className="flex gap-1.5">
      {Array.from({ length: size }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === index ? "w-5 bg-primary" : "w-1.5 bg-muted"
          }`}
        />
      ))}
    </div>

    <div className="flex items-center justify-between pt-1">
      {!isLastStep ? (
        <Button
          {...skipProps}
          variant="link"
          size="sm"
          className="px-0 text-muted-foreground"
        >
          Skip tour
        </Button>
      ) : (
        <span />
      )}
      <div className="flex gap-2">
        {index > 0 && (
          <Button {...backProps} variant="outline" size="sm">
            Back
          </Button>
        )}
        <Button {...primaryProps} size="sm">
          {isLastStep ? "Done" : "Next"}
        </Button>
      </div>
    </div>
  </Card>
);

export default TourTooltip;
