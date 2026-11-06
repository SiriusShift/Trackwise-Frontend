// CSS device frames for landing page screenshots. Each screen clips its children to the device's aspect ratio.
import type { ReactNode } from "react";

// Base overhangs the lid by 6% on each side, so leave that much room around a laptop
export const Laptop = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="rounded-t-xl border-[6px] border-b-10 border-zinc-800 bg-zinc-800 shadow-2xl shadow-primary/10">
      <div className="aspect-16/10 overflow-hidden rounded-sm bg-card">
        {children}
      </div>
    </div>
    {/* Base is wider than the lid, with the opening notch in the middle */}
    <div className="relative mx-[-6%] h-3 rounded-b-xl bg-zinc-700">
      <div className="absolute left-1/2 top-0 h-1 w-1/6 -translate-x-1/2 rounded-b-md bg-zinc-900" />
    </div>
  </div>
);

export const Tablet = ({ children }: { children: ReactNode }) => (
  <div className="rounded-[1.1rem] border-[6px] border-zinc-800 bg-zinc-800 shadow-2xl shadow-primary/20">
    <div className="aspect-3/4 overflow-hidden rounded-[0.6rem] bg-card">
      {children}
    </div>
  </div>
);

export const Phone = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border-4 border-zinc-800 bg-zinc-800 shadow-2xl shadow-primary/20">
    <div className="aspect-9/19 overflow-hidden rounded-xl bg-card">
      {children}
    </div>
  </div>
);
