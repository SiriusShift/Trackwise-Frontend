import { IRootState } from "@/app/store";
import { type } from "@/features/transactions/constants/constants";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { setType } from "@/shared/slices/activeSlice";
import { useDispatch, useSelector } from "react-redux";

// Expense / Income / Transfer as tabs: one tap to switch, all options visible
const TypeSelect = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const dispatch = useDispatch();
  const activeType = useSelector((state: IRootState) => state.active.type);

  return (
    <Tabs
      value={activeType}
      onValueChange={(value) => dispatch(setType(value))}
      className={cn(fullWidth && "w-full")}
    >
      <TabsList
        aria-label="Transaction type"
        data-tour="type"
        className={cn(fullWidth && "grid h-11 w-full grid-cols-3")}
      >
        {type?.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.name}
            className={cn("px-2.5 @sm:px-3", fullWidth && "h-full")}
          >
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TypeSelect;
