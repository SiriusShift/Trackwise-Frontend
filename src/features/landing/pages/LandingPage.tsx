import { usePageMeta } from "@/shared/hooks/usePageMeta";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import CreditCardSection from "../components/CreditCardSection";
import CtaSection from "../components/CtaSection";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import LandingFooter from "../components/LandingFooter";
import LandingNavbar from "../components/LandingNavbar";
import StepsSection from "../components/StepsSection";

const LandingPage = () => {
  usePageMeta({
    title: "Trackwise | Personal finance tracker",
    description:
      "Track expenses, income, and transfers in one place. Schedule recurring transactions and keep your credit card billing under control.",
  });
  const [cookies] = useCookies(["user"]);

  // Signed-in users skip the marketing page; ProtectedRoutes re-validates the session
  if (cookies.user) {
    return <Navigate to="/dashboard" replace />;
  }

  // The `dark` class scopes the app's dark theme tokens to this page regardless of the user's theme
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CreditCardSection />
        <StepsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
