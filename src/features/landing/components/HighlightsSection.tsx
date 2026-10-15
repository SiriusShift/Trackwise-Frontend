import { Card } from "@/shared/components/ui/card";
import { Bell, Clock, Coins, Palette, SunMoon, Tags } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const personalization = [
  { icon: Tags, label: "Custom categories" },
  { icon: Palette, label: "Your colors and icons" },
  { icon: Coins, label: "Any currency" },
  { icon: Clock, label: "Timezone and time format" },
  { icon: SunMoon, label: "Light and dark theme" },
];

const HighlightsSection = () => (
  <section className="border-b border-border/60 pb-20 lg:pb-24">
    <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-5">
      <ScrollReveal
        className="h-full lg:col-span-2"
        fromScale={0.96}
        fromOpacity={0.3}
        fromY={24}
      >
        <Card className="h-full p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">Reminders before it's due</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get an email about scheduled transactions, as many days ahead as you
            choose.
          </p>
        </Card>
      </ScrollReveal>

      <ScrollReveal
        className="h-full lg:col-span-3"
        fromScale={0.96}
        fromOpacity={0.3}
        fromY={24}
      >
        <Card className="h-full p-6">
          <h3 className="font-semibold">Make it yours</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Set Trackwise up the way you think about money.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {personalization.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>
    </div>
  </section>
);

export default HighlightsSection;
