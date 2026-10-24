import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    q: "Does Trackwise connect to my bank or e-wallet?",
    a: "No. You add transactions yourself, or schedule the ones that repeat. Because of that, Trackwise never needs your bank or e-wallet login, and it works with any bank, e-wallet, or cash.",
  },
  {
    q: "Which currencies does it support?",
    a: "Any currency. Set your currency, timezone, and time format in settings, and every amount and date is shown your way.",
  },
  {
    q: "How does credit card tracking work?",
    a: "Each card has monthly statement cycles. Charges, payments, interest, and fees go on the statement they belong to, installments are tracked alongside them, and due dates are added to your calendar.",
  },
  {
    q: "What happens with recurring bills and paychecks?",
    a: "Set them up once with how often they repeat. Trackwise schedules them for you, and reminders let you know before something is due.",
  },
  {
    q: "Can I get my data out?",
    a: "Yes. Download account and credit card statements as PDF, or export your transactions as Excel or CSV.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. Trackwise runs in your browser, so you can use it on your phone or your computer and see the same data on both.",
  },
];

const FaqSection = () => (
  <section id="faq" className="scroll-mt-16 border-b border-border/60 py-20 lg:py-24">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Frequently asked questions
      </h2>

      <ScrollReveal fromOpacity={0.3} fromY={24}>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map(({ q, a }) => (
            <AccordionItem key={q} value={q} className="border-border/60">
              <AccordionTrigger className="text-left hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </div>
  </section>
);

export default FaqSection;
