import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useMemo, useState } from "react";
import { SavingsData } from "../types/savings.types";
import GoalCard from "./GoalCard";
import GoalCardSkeleton from "./GoalCardSkeleton";

const sortList = [
  {
    id: 1,
    label: "Due date",
    value: "due",
  },
  {
    id: 2,
    label: "Progress",
    value: "progress",
  },
  {
    id: 3,
    label: "Amount left",
    value: "remaining",
  },
];
const GoalList = ({
  data,
  active,
  setActive,
  isLoading,
}: {
  data: SavingsData[];
  active: number | undefined;
  setActive: (active: number) => void;
  isLoading: boolean;
}) => {
  const [sort, setSort] = useState<string>("due");
  const [tab, setTab] = useState<string>("active");

  console.log(data);

  const { activeGoals, completedGoals } = useMemo(() => {
    const active = [];
    const completed = [];
    for (const saving of data ?? []) {
      if (saving?.remainingAmount === 0) completed.push(saving);
      else active.push(saving);
    }
    return { activeGoals: active, completedGoals: completed };
  }, [data]);

  return (
    <Card className="col-span-1 flex flex-col p-4 gap-3">
      <div className="flex flex-row justify-between items-center">
        <span className="font-bold">Goals</span>
        <div className="flex flex-row: items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-28 text-sm h-8">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sortList.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active ·{" "}
            {isLoading ? (
              <Skeleton className="ms-1 h-4 w-4" />
            ) : (
              activeGoals.length
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ·{" "}
            {isLoading ? (
              <Skeleton className="ms-1 h-4 w-4" />
            ) : (
              completedGoals.length
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-2">
          {isLoading
            ? Array.from({ length: 3 }).map((item, index) => (
                <GoalCardSkeleton key={index} />
              ))
            : activeGoals.map((saving) => (
                <GoalCard data={saving} setActive={setActive} active={active} />
              ))}
        </TabsContent>
        <TabsContent value="completed">
          {" "}
          {completedGoals.map((saving) => (
            <GoalCard data={saving} setActive={setActive} active={active} />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default GoalList;
