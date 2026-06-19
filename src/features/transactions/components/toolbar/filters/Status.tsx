import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

const Status = ({
  status,
  setStatus,
}: {
  status: string;
  setStatus: (status: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-semibold">Status</h1>
      <RadioGroup
        value={status}
        onValueChange={(value) => setStatus(value)} // Ensure value is updated
        className="space-y-2"
      >
        {/* Option 1 */}
        <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-warning">
          <RadioGroupItem id="Pending" value="Pending" />
          <label htmlFor="Pending" className="text-sm font-medium">
            Pending
          </label>
        </div>
        {/* Option 2 */}
        <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-success">
          <RadioGroupItem id="Paid" value="Paid" />
          <label htmlFor="Paid" className="text-sm font-medium">
            Completed
          </label>
        </div>
        {/* Option 3 */}
        <div className="flex items-center space-x-2 border px-4 h-10 rounded-md border-destructive">
          <RadioGroupItem id="Overdue" value="Overdue" />
          <label htmlFor="Overdue" className="text-sm font-medium">
            Overdue
          </label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default Status;
