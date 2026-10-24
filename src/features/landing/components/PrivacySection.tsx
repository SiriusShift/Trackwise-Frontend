import { Card } from "@/shared/components/ui/card";
import { Download, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const points = [
  {
    icon: ShieldCheck,
    title: "No bank logins",
    desc: "You enter your own transactions, so Trackwise never asks for your bank or e-wallet credentials.",
  },
  {
    icon: KeyRound,
    title: "Protected passwords",
    desc: "Passwords are hashed before they are stored. You can also sign in with Google instead.",
  },
  {
    icon: LockKeyhole,
    title: "Secure sessions",
    desc: "Sessions use secure, HTTP-only cookies, and password resets are rate limited.",
  },
  {
    icon: Download,
    title: "Your data goes with you",
    desc: "Export your transactions as PDF, Excel, or CSV whenever you need them.",
  },
];

const PrivacySection = () => (
  <section
    id="privacy"
    className="scroll-mt-16 border-b border-border/60 py-20 lg:py-24"
  >
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Your money, your data</h2>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Trackwise only knows what you tell it, and it keeps that information safe.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(({ icon: Icon, title, desc }) => (
          <ScrollReveal
            key={title}
            className="h-full"
            fromScale={0.96}
            fromOpacity={0.3}
            fromY={24}
          >
            <Card className="h-full p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default PrivacySection;
