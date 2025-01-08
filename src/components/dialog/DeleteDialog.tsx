import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export function DeleteDialog({
  onDelete,
  type,
  isLoading,
}: {
  onDelete: () => void;
  type: string;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type === "Recurring" ? "Recurring" : ""} Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {type === "Recurring" ? "recurring" : ""} expense? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => {
              // Add your delete logic here
              onDelete();
              setOpen(false); // Close the dialog after delete
            }}
            variant="destructive"
          >
            {isLoading ? (
              <span
                className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"
                aria-hidden="true"
              ></span>
            ) : (
              "Confirm"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
