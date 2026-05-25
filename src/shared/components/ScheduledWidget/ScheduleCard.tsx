import React from "react";
import { CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import * as Icons from "lucide-react"
import { ChartContainer } from "../ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";
const ScheduleCard = ({count, type}) => {
  return (
    <CarouselItem
      className={`${count > 0 ? "basis-[90%]" : "basis-[100%]"} xl:basis-1/2`}
    >
      <Card className="relative bg-muted/30">
        {/* Actions menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute top-2 right-2 w-5"
              variant="ghost"
              type="button"
              aria-label="Card options"
            >
              <Icons.EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              <Icons.Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(item)}>
              <Icons.Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            {/* 
                NOTE: "View" was wired to onDelete in the original — 
                replace with the correct handler when ready.
              */}
            <DropdownMenuItem disabled>
              <Icons.Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Card body */}
        <CardContent className="flex h-[80px] items-center p-1">
            <Card>
                {type === "Expense" ? <Icons.ArrowDown /> : type === "Income" ? <Icons.ArrowUp /> : <Icons.ArrowRightLeft />}
            </Card>

          <div className="flex flex-col min-w-0">
            <p className="font-medium text-sm truncate">{item.category.name}</p>
            <p
              className={`text-xs ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}
            >
              ₱{Number(item.total).toFixed(2)}{" "}
              <span className="text-muted-foreground">
                / {Number(limit).toFixed(2)}
              </span>
            </p>
            {/* Over-budget indicator */}
            {isOverBudget && (
              <p className="text-xs text-destructive font-medium mt-0.5">
                Over budget
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

export default ScheduleCard;
