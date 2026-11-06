// Phone mockup shown in the hero on small screens, where the desktop screenshot is too small to read.
import DashboardMobileDark from "@/assets/images/Dashboard-M-dark.webp";
import DashboardMobileLight from "@/assets/images/Dashboard-M-light.webp";
import { FileText, PiggyBank, Utensils } from "lucide-react";
import FloatingCard, { type FloatingCardProps } from "./FloatingCard";

const stickers: FloatingCardProps[] = [
  // Budgets, savings and statements: the calendar section's cards already cover scheduled payments
  {
    icon: PiggyBank,
    tone: "bg-success/15 text-success",
    title: "Emergency Fund",
    detail: "60% of goal reached",
    rotate: -6,
    delay: 0.9,
    distance: 40,
    className: "-left-10 top-10",
  },
  {
    icon: Utensils,
    tone: "bg-destructive/15 text-destructive",
    title: "Food budget",
    detail: "82% used this month",
    rotate: 5,
    delay: 1.05,
    distance: 70,
    className: "-right-10 top-24",
  },
  {
    icon: FileText,
    tone: "bg-primary/15 text-primary",
    title: "October statement",
    detail: "PDF ready to download",
    rotate: -4,
    delay: 1.2,
    distance: 55,
    className: "-left-8 top-38",
  },
];

const HeroPhone = ({ isDark }: { isDark: boolean }) => (
  <div className="relative mx-auto w-fit">
    {/* The captures include their own phone frame; the box keeps only the top half (394×397 of 394×794),
        which also hides the browser address bar at the bottom of the capture */}
    <div className="aspect-[394/397] w-[250px] overflow-hidden">
      <img
        src={isDark ? DashboardMobileDark : DashboardMobileLight}
        alt="Trackwise dashboard on a phone showing net worth, debt change and net cash flow"
        className="w-full drop-shadow-2xl"
      />
    </div>
    <div aria-hidden>
      {stickers.map((s) => (
        <FloatingCard key={s.title} {...s} />
      ))}
    </div>
  </div>
);

export default HeroPhone;
