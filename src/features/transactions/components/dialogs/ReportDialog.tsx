import { cn } from "@/lib/utils";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { AssetData, commonDialogProps } from "@/shared/types";
import { pdf } from "@react-pdf/renderer";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { useLazyGetTransactionStatementQuery } from "../../api/transaction/reportsApi";
import StatementPDF from "../reports/TransactionStatement";

type ExportFormat = "csv" | "json" | "excel";

const PRESETS = [
  {
    label: "This Month",
    getRange: () => ({
      from: moment().startOf("month").toDate(),
      to: moment().endOf("month").toDate(),
    }),
  },
  {
    label: "Last Month",
    getRange: () => ({
      from: moment().subtract(1, "month").startOf("month").toDate(),
      to: moment().subtract(1, "month").endOf("month").toDate(),
    }),
  },
  {
    label: "Last 3 Months",
    getRange: () => ({
      from: moment().subtract(2, "months").startOf("month").toDate(),
      to: moment().endOf("month").toDate(),
    }),
  },
  {
    label: "This Year",
    getRange: () => ({
      from: moment().startOf("year").toDate(),
      to: moment().endOf("year").toDate(),
    }),
  },
];

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ReportDialog = ({ open, setOpen }: commonDialogProps) => {
  const [range, setRange] = useState<DateRange | undefined>(
    PRESETS[0].getRange(),
  );
  const [account, setAccount] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState<string>("This Month");
  const [format, setFormat] = useState<ExportFormat>("json");
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const currency = useSelector((state: IRootState) => state.settings.currency);

  const { data: rawAssetData, isLoading: assetLoading } = useGetAccountsQuery();
  const [getStatement, { isFetching: isFetchingStatement }] =
    useLazyGetTransactionStatementQuery();

  const handlePresetClick = (preset: (typeof PRESETS)[number]) => {
    setRange(preset.getRange());
    setActivePreset(preset.label);
  };

  const handleCustomRange = (newRange: DateRange | undefined) => {
    setRange(newRange);
    setActivePreset("Custom");
  };

  const canExport = Boolean(range?.from && range?.to && account);

  const handleExport = async () => {
    if (!range?.from || !range?.to || !account) return;

    setError(null);
    setIsExporting(true);

    try {
      const fromStr = moment(range.from);
      const toStr = moment(range.to);
      const from = fromStr.format("MM-DD-YYYY");
      const to = toStr.format("MM-DD-YYYY");

      const { data, isError } = await getStatement({
        assetId: account,
        from: fromStr,
        to: toStr,
        format,
      });

      if (isError || !data) {
        setError("Failed to generate report. Try again.");
        return;
      }

      console.log(data);

      const accountName =
        rawAssetData?.data?.find((a: AssetData) => a.id === account)?.name ??
        "Account";

      if (format === "json") {
        const blob = await pdf(
          <StatementPDF
            accountName={accountName}
            from={fromStr}
            to={toStr}
            openingBalance={data.data.openingBalance}
            closingBalance={data.data.closingBalance}
            totalCredit={data.data.totalCredit}
            totalDebit={data.data.totalDebit}
            transactions={data.data.transactions}
            currency={currency}
          />,
        ).toBlob();
        const from = moment(range.from).format("MM-DD-YYYY");
        const to = moment(range.to).format("MM-DD-YYYY");

        downloadBlob(
          blob,
          `Transaction-Statement_${accountName}_${from}_to_${to}.pdf`,
        );
      } else {
        const ext = format === "excel" ? "xlsx" : "csv";
        downloadBlob(
          data,
          `Transaction-Statement_${accountName}_${from}_to_${to}.${ext}`,
        );
      }

      setOpen(false);
    } catch (err) {
      console.error("Failed to export report:", err);
      setError("Failed to generate report. Try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const isBusy = isExporting || isFetchingStatement;

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      icon={FileSpreadsheet}
      title="Export Transaction Report"
    >
      <div className="p-4 space-y-5">
        {/* Date range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Range</Label>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                aria-pressed={activePreset === preset.label}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-colors",
                  activePreset === preset.label
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !range && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range?.from && range?.to ? (
                  <>
                    {moment(range.from).format("MMM D, YYYY")} –{" "}
                    {moment(range.to).format("MMM D, YYYY")}
                  </>
                ) : (
                  <span>Pick a custom date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={range}
                onSelect={handleCustomRange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Account */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Account</Label>
          <Select
            value={account ? account.toString() : ""}
            onValueChange={(value) => setAccount(Number(value))}
            disabled={assetLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  assetLoading ? "Loading accounts..." : "Select account"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {rawAssetData?.data?.map((asset: AssetData) => (
                  <SelectItem key={asset.id} value={asset.id.toString()}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Format selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Export Format</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={format === "json"}
              onClick={() => setFormat("json")}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                format === "json"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button
              type="button"
              aria-pressed={format === "excel"}
              onClick={() => setFormat("excel")}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                format === "excel"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
            <button
              type="button"
              aria-pressed={format === "csv"}
              onClick={() => setFormat("csv")}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                format === "csv"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <FileSpreadsheet className="h-4 w-4" />
              CSV
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={!canExport || isBusy}>
            {isBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </CommonDialog>
  );
};

export default ReportDialog;
