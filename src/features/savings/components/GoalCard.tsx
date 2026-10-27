import { IRootState } from "@/app/store";
import { StackedBar } from "@/shared/components/charts/CommonBar";
import { IconBadge } from "@/shared/components/IconBadge";
import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import moment from "moment";
import { useSelector } from "react-redux";
import { SavingsData } from "../types/savings.types";

const GoalCard = ({
  data,
  setActive,
  active,
}: {
  data: SavingsData;
  setActive: (active: number) => void;
  active: number | undefined;
}) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const progress = Math.round(data.progress * 100);
  const completed = data.remainingAmount <= 0;

  return (
    <Card
      key={data.id}
      className={`p-3 hover:shadow cursor-pointer transition-shadow space-y-3 duration-200 ${active === data.id ? "ring-2 ring-primary" : ""}`}
      onClick={() => setActive(data.id)}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3 items-center">
          {" "}
          <IconBadge icon={data?.icon} size="lg" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{data.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatCurrency(data.savedAmount, currency, "symbol", 0)} of{" "}
              {formatCurrency(Number(data.targetAmount), currency, "symbol", 0)}
            </span>
          </div>
        </div>

        <span>{progress}%</span>
      </div>
      <StackedBar
        segments={[
          {
            label: "Saved amount",
            value: data.savedAmount,
            color: data.isOnTrack
              ? "hsl(var(--success))"
              : "hsl(var(--warning))",
          },
        ]}
        maxColor="hsl(var(--primary))"
        maxValue={Number(data.targetAmount)}
        mode="progress"
      />
      <div className="flex flex-row justify-between">
        <span
          className={`rounded-full font-bold text-xs px-2 py-0.5 ${completed ? "text-primary bg-primary/20" : data.targetDate ? (data.isOnTrack ? "text-green-700 bg-success/20" : "text-amber-700 bg-warning/20") : "bg-muted text-muted-foreground dark:text-muted-foreground"}`}
        >
          {completed
            ? "Completed"
            : data.targetDate
              ? data.isOnTrack
                ? "On track"
                : "Behind"
              : "No deadline"}
        </span>
        <span className="text-xs">
          {data.targetDate
            ? `Due ${moment(data.targetDate).format("MMM YYYY")}`
            : "No due date"}
        </span>
      </div>
    </Card>
  );
};

export default GoalCard;
