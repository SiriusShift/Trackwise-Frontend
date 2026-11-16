import FilterChip from "./FilterChip";
import { STATUS_OPTIONS } from "./filterState";

const Status = ({
  status,
  setStatus,
}: {
  status: string;
  setStatus: (status: string) => void;
}) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">Status</legend>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <FilterChip
            key={option.label}
            selected={status === option.value}
            onToggle={() => setStatus(option.value)}
          >
            {option.label}
          </FilterChip>
        ))}
      </div>
    </fieldset>
  );
};

export default Status;
