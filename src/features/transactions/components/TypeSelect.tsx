import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { setType } from "@/shared/slices/activeSlice";
import { type } from "@/features/transactions/constants/constants";
import { useDispatch, useSelector } from "react-redux";

const TypeSelect = () => {
  const dispatch = useDispatch();
  const activeType = useSelector((state: any) => state.active.type);

  return (
    <Select
      value={activeType}
      onValueChange={(value) => {
        dispatch(setType(value))
      }}
    >
      <SelectTrigger className="h-9 w-[150px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {type?.map((item) => (
          <SelectItem key={item.id} value={item.name}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TypeSelect;
