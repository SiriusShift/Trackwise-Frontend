// Shared by rows, the column header and the loading skeleton so they line up.
// Frequency and due only show from md; the amount is fixed-width from md too.
export const RECURRING_COLS = {
  row: "flex items-center gap-3 px-4 sm:gap-4 sm:px-5",
  icon: "w-10",
  frequency: "hidden w-44 shrink-0 md:flex",
  due: "hidden w-32 shrink-0 md:flex",
  amount: "shrink-0 text-right md:w-36",
  menu: "-mr-2 w-8 shrink-0",
};
