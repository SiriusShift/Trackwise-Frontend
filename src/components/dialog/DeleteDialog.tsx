import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"; // Ensure these components are correctly exported
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteDialog({
  onDelete,
  isLoading,
}: {
  onDelete: () => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
