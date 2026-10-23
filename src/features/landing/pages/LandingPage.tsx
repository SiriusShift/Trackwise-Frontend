import { usePageMeta } from "@/shared/hooks/usePageMeta";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import CtaSection from "../components/CtaSection";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import HighlightsSection from "../components/HighlightsSection";
import LandingFooter from "../components/LandingFooter";
import LandingNavbar from "../components/LandingNavbar";
import StatementsSection from "../components/StatementsSection";
import StepsSection from "../components/StepsSection";
import CreditCardSection from "../components/CreditCardSection";

const LandingPage = () => {
  usePageMeta({
    title: "Trackwise | Personal finance tracker",
    description:
      "Trackwise is a personal finance tracker. Log expenses, income, and transfers across your accounts, schedule recurring payments, and download statements.",
  });
  const [cookies] = useCookies(["user"]);

  // Signed-in users skip the marketing page; ProtectedRoutes re-validates the session
  if (cookies.user) {
    return <Navigate to="/dashboard" replace />;
  }

  // The `dark` class scopes the app's dark theme tokens to this page regardless of the user's theme
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HighlightsSection />
        <CreditCardSection />
        <StatementsSection />
        <StepsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
