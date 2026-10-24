import { Link } from "react-router-dom";

const LandingFooter = () => (
  <footer className="border-t border-border/60">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
      <p>© {new Date().getFullYear()} Trackwise</p>
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link to="/privacy" className="transition-colors hover:text-foreground">
          Privacy
        </Link>
        <Link to="/terms" className="transition-colors hover:text-foreground">
          Terms
        </Link>
        <Link to="/sign-in" className="transition-colors hover:text-foreground">
          Sign in
        </Link>
        <Link to="/sign-up" className="transition-colors hover:text-foreground">
          Create account
        </Link>
      </nav>
    </div>
  </footer>
);

export default LandingFooter;
