import { cn } from "@/lib/utils";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { commonDialogProps } from "@/shared/types";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CommonDialogProps extends commonDialogProps {
  isDirty?: boolean;
  reset?: () => void;
  children: ReactNode;
  title: string;
  description?: string;
  icon?: LucideIcon;
  preventClickOutside?: boolean;
  contentClassName?: string;
}

const CommonDialog = ({
  open,
  setOpen,
  isDirty = false,
  reset,
  children,
  title,
  description,
  icon: Icon,
  preventClickOutside = false,
  contentClassName = "sm:max-w-lg",
}: CommonDialogProps) => {
  const { confirm } = useConfirm();
  const handleCloseIntent = () => {
    if (!isDirty) {
      setOpen(false);
      return;
    }

    confirm({
      title: "Discard changes?",
      description: "All unsaved changes will be lost.",
      variant: "destructive",
      confirmText: "Discard",
      cancelText: "Keep editing",
      onConfirm: () => {
        reset?.();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleCloseIntent();
        else setOpen(nextOpen);
      }}
    >
      <DialogContent
        className={
          (cn(
            "flex flex-col w-full max-w-full h-dvh p-0  sm:h-auto sm:max-h-[90vh] overflow gap-0",
          ),
          contentClassName)
        }
        onInteractOutside={(e) => preventClickOutside && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 px-6 py-5 border-b space-y-0">
          {Icon && <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />}

          <div className="min-w-0 space-y-0">
            <DialogTitle className="text-start">{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
