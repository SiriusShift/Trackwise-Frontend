import AnimatedLogo from "@/shared/components/AnimatedLogo";

interface LoadingScreenProps {
  message?: string;
}

function LoadingScreen({ message = "Loading your finances" }: LoadingScreenProps) {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background animate-loading-fade-in"
      role="status"
      aria-live="polite"
    >
      <AnimatedLogo className="h-20 w-20" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          Trackwise
        </span>
        <span className="flex items-baseline text-muted-foreground">
          {message}
          <span className="loading-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default LoadingScreen;
