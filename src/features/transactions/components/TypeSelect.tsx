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
import { IRootState } from "@/app/store";

const TypeSelect = () => {
  const dispatch = useDispatch();
  const activeType = useSelector((state: IRootState) => state.active.type);

  return (
    <Select
      value={activeType}
      onValueChange={(value) => {
        dispatch(setType(value))
      }}
    >
      <SelectTrigger className="h-9 w-[125px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {type?.map((item, key) => (
          <SelectItem key={item.id + key} value={item.name}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TypeSelect;
