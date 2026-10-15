import { Button } from "@/shared/components/ui/button";
import { WalletMinimal } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Statements", href: "#statements" },
  { label: "How it works", href: "#how-it-works" },
];

const LandingNavbar = () => (
  <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <WalletMinimal className="h-6 w-6 text-primary" />
        Trackwise
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hidden px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline"
          >
            {link.label}
          </a>
        ))}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
        <Button size="sm" className="rounded-full px-4" asChild>
          <Link to="/sign-up">Get started</Link>
        </Button>
      </nav>
    </div>
  </header>
);

export default LandingNavbar;
