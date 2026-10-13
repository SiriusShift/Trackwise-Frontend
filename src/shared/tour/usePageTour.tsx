import { IRootState } from "@/app/store";
import TourTooltip from "@/shared/components/TourTooltip";
import { useEffect, useRef, useState } from "react";
import { useJoyride } from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TourPage, tourOrder, tourRoutes, tourSteps } from "./tourSteps";
import { setHasSeenTour } from "../slices/userSlice";
import { usePatchCompleteTourMutation } from "@/features/auth/api/signinApi";

const storageKey = (page: TourPage) => `trackwise:tour:${page}`;

const hasSeenPage = (page: TourPage) => {
  try {
    return localStorage.getItem(storageKey(page)) === "1";
  } catch {
    return false;
  }
};

const markPageSeen = (page: TourPage) => {
  try {
    localStorage.setItem(storageKey(page), "1");
  } catch {
    // Storage unavailable: the tour may show again, which is harmless
  }
};

// Steps whose target isn't on screen (e.g. the chart on the Transfer tab) are
// skipped. Steps with a `data.route` live on another route, so they're kept and
// the tour waits for their target after navigating.
const getAvailableSteps = (page: TourPage) =>
  tourSteps[page].filter(
    (step) =>
      step.data?.route ||
      typeof step.target !== "string" ||
      document.querySelector(step.target) !== null,
  );

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Pages load their data asynchronously, so give the targets a moment to render.
const WAIT_ATTEMPTS = 20;
const WAIT_INTERVAL_MS = 150;

/**
 * Runs the guided tour for one page. For users who haven't completed the tour
 * it starts automatically, and when a page's tour finishes it navigates to the
 * next page in `tourOrder`, whose own hook picks it up. Skipping ends the whole
 * tour. After the last page the tour is marked complete on the server.
 *
 * Returns the `Tour` element to render, and `start` to replay it manually.
 */
const usePageTour = (page: TourPage) => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState(tourSteps[page]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const [completeTour] = usePatchCompleteTourMutation();

  const hasSeenTour = useSelector(
    (state: IRootState) => state.userDetails.hasSeenTour,
  );

  const start = (attempt = 0) => {
    const available = getAvailableSteps(page);
    if (available.length === 0) {
      if (attempt < WAIT_ATTEMPTS) {
        timer.current = setTimeout(() => start(attempt + 1), WAIT_INTERVAL_MS);
      }
      return;
    }
    // Steps with a `data.route` navigate there before they are shown
    setSteps(
      available.map((step) => {
        const route: string | undefined = step.data?.route;
        if (!route) return step;
        return {
          ...step,
          before: async () => {
            if (window.location.pathname !== route) {
              navigate(route);
              await sleep(WAIT_INTERVAL_MS * 2);
            }
          },
        };
      }),
    );
    setRun(true);
  };

  const finishTour = () => {
    tourOrder.forEach(markPageSeen);
    dispatch(setHasSeenTour(true));
    completeTour({});
  };

  // null = still loading, so wait until we know
  useEffect(() => {
    if (hasSeenTour === false && !hasSeenPage(page)) {
      start();
    }
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSeenTour, page]);

  const { Tour } = useJoyride({
    continuous: true,
    onEvent: (data) => {
      // Fires whether the user finishes, skips or closes the tour
      if (data.type !== "tour:end") return;

      setRun(false);
      markPageSeen(page);

      if (data.status === "skipped") {
        finishTour();
        return;
      }

      const next = tourOrder[tourOrder.indexOf(page) + 1];
      if (next) {
        navigate(tourRoutes[next]);
      } else {
        finishTour();
      }
    },
    steps,
    run,
    tooltipComponent: TourTooltip,
    options: {
      arrowColor: "hsl(var(--card))",
      overlayColor: "rgba(0, 0, 0, 0.6)",
      scrollOffset: 64,
      skipBeacon: true,
      targetWaitTimeout: 3000,
      spotlightPadding: 16,
      spotlightRadius: 16,
    },
  });

  return { Tour, start: () => start() };
};

export default usePageTour;
