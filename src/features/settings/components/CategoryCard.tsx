import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { CategoryType } from "@/shared/types";
import { hexToRgba } from "@/shared/utils/CustomFunctions";
import * as LucideIcons from "lucide-react";
import { Archive, Edit, RotateCw } from "lucide-react";
import { ComponentType } from "react";

const CategoryCard = ({
  category,
  onEdit,
  onArchiveToggle,
}: {
  category: CategoryType;
  onEdit?: (category: CategoryType) => void;
  onArchiveToggle?: (category: CategoryType) => void;
}) => {
  const Icon = category.icon
    ? ((LucideIcons[
        category.icon as keyof typeof LucideIcons
      ] as ComponentType<LucideIcons.LucideProps>) ?? LucideIcons.Circle)
    : LucideIcons.Circle;

  const accent = category.color ?? "#6B7280";
  const tint = hexToRgba(accent, 0.2) ?? hexToRgba("#6B7280", 0.2);
  const isSystemCategory = !category.userId;
  return (
    <Card
      className={`flex flex-row items-center justify-between p-4 transition-opacity ${
        category.isActive === false ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ color: accent, backgroundColor: tint ?? undefined }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium leading-tight">
              {category.name}
            </span>
          </div>
          <span className="text-xs capitalize text-muted-foreground">
            {category.type?.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSystemCategory ? (
          <LucideIcons.Globe className="h-4 w-4 mr-2 text-muted-foreground" />
        ) : (
          <LucideIcons.User className="h-4 w-4 mr-2 text-muted-foreground" />
        )}
        {category.isActive === false && (
          <Badge variant="outline" className="text-[10px] font-normal">
            Archived
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Edit ${category.name}`}
          onClick={() => onEdit?.(category)}
          disabled={isSystemCategory}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={
            category.isActive === false
              ? `Restore ${category.name}`
              : `Archive ${category.name}`
          }
          disabled={isSystemCategory}
          onClick={() => onArchiveToggle?.(category)}
        >
          {category.isActive === false ? (
            <RotateCw className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CategoryCard;
