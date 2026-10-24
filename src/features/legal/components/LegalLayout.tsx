import LandingFooter from "@/features/landing/components/LandingFooter";
import { Button } from "@/shared/components/ui/button";
import { WalletMinimal } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LAST_UPDATED } from "../constants";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
}

const LegalLayout = ({ title, intro, sections }: LegalLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <WalletMinimal className="h-6 w-6 text-primary" />
          Trackwise
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" className="rounded-full px-4" asChild>
            <Link to="/sign-up">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>

    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <nav className="sticky top-8 flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground">On this page</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="transition-colors hover:text-foreground"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated {LAST_UPDATED}
          </p>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            {intro}
          </div>

          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-8">
              <h2 className="text-xl font-semibold text-foreground">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>

    <LandingFooter />
  </div>
);

export default LegalLayout;
