import * as Icon from "lucide-react";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
export const InfoRow = ({ icon: IconComponent, label, value, onPreview }) => (
  <div
    className={`flex flex-1 items-start justify-between gap-3 ${
      label === "Image" && "flex-col"
    }`}
  >
    <div className="flex flex-row gap-1">
      <IconComponent className="mt-0.5 text-muted-foreground" size={15} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>

    {label === "Image" ? (
      value ? (
        <button
          type="button"
          onClick={() => onPreview(value)}
          className="group relative h-52 w-full overflow-hidden rounded-xl"
        >
          <img
            src={value}
            alt="Transaction attachment"
            className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">
              View Image
            </span>
          </div>
        </button>
      ) : (
        <Card className="text-sm text-muted-foreground w-full h-52 flex flex-col items-center justify-center">
          <Icon.ImageOff />
          <h1>No image</h1>
        </Card>
      )
    ) : label === "Schedule" ? (
      <div className="flex min-w-0 shrink items-center gap-1 overflow-hidden">
        <Badge
          variant="outline"
          className="shrink-0 text-xs font-semibold capitalize tracking-wide bg-blue-100 text-blue-700"
        >
          {value?.label}
        </Badge>

        {value?.behaviour && (
          <Badge
            variant="outline"
            className={`shrink-0 text-xs font-semibold capitalize tracking-wide ${value.behaviour === "REMIND" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}
          >
            {value.behaviour === "AUTO_LOG" ? "Auto Log" : value.behaviour}
          </Badge>
        )}
      </div>
    ) : (
      <p className="font-medium break-words text-sm">{value || "N/A"}</p>
    )}
  </div>
);
