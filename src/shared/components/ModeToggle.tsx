import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/provider/ThemeProvider";
import { useRef } from "react";
import { flushSync } from "react-dom";

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  console.log(theme)
  const changeTheme = async () => {
    await document.startViewTransition(() => {
      flushSync(() => {
        const dark = document.documentElement.classList.toggle("dark");
        setTheme(dark ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <Button
      ref={buttonRef}
      onClick={changeTheme}
      variant="ghost"
      size="icon"
      className="relative "
    >
      {theme === "dark" ? (
        <Moon />
      ) : (
        <Sun  />
      )}
    </Button>
  );
};

export default ModeToggle;
