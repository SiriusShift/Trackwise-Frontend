import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { AlertCircle, AlertTriangle, Info, type LucideIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";

type ConfirmVariant = "destructive" | "warning" | "info";

interface ConfirmResult {
  confirmed: boolean;
  data?: any;
}

interface ConfirmOptions {
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  // Enhanced callback options
  onConfirm?: () => Promise<any> | any;
  onCancel?: () => Promise<any> | any;
  onOpen?: () => void;
  onClose?: () => void;
  // Loading state management
  showLoadingOnConfirm?: boolean;
  showLoadingOnCancel?: boolean;
  // Prevent closing during async operations
  preventCloseOnOutsideClick?: boolean;
  preventCloseOnEscape?: boolean;
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<ConfirmResult>;
  isOpen: boolean;
  isLoading: boolean;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(value: ConfirmResult) => void>();

  const confirm = useCallback(async (options: ConfirmOptions = {}) => {
    setOptions(options);
    setIsOpen(true);

    // Call onOpen callback if provided
    if (options.onOpen) {
      try {
        options.onOpen();
      } catch (error) {
        console.error("onOpen callback error:", error);
      }
    }

    return new Promise<ConfirmResult>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(
    (result: ConfirmResult) => {
      setIsOpen(false);
      setIsLoading(false);

      // Call onClose callback if provided
      if (options.onClose) {
        try {
          options.onClose();
        } catch (error) {
          console.error("onClose callback error:", error);
        }
      }

      if (resolverRef.current) {
        resolverRef.current(result);
        resolverRef.current = undefined;
      }
    },
    [options],
  );

  const handleConfirm = useCallback(async () => {
    try {
      // Show loading if requested
      if (options.showLoadingOnConfirm !== false) {
        setIsLoading(true);
      }

      let result: any;
      if (options.onConfirm) {
        result = await options.onConfirm();
      }

      handleClose({ confirmed: true, data: result });
    } catch (error) {
      console.error("Confirmation error:", error);
      setIsLoading(false);
      // Don't close dialog on error, let user decide what to do
    }
  }, [options, handleClose]);

  const handleCancel = useCallback(async () => {
    try {
      // Show loading if requested
      if (options.showLoadingOnCancel) {
        setIsLoading(true);
      }

      let result: any;
      if (options.onCancel) {
        result = await options.onCancel();
      }

      handleClose({ confirmed: false, data: result });
    } catch (error) {
      console.error("Cancellation error:", error);
      setIsLoading(false);
      // Don't close dialog on error
    }
  }, [options, handleClose]);

  const getVariantStyles = (): {
    iconClass: string;
    Icon: LucideIcon;
  } => {
    switch (options.variant) {
      case "destructive":
        return {
          iconClass: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
          Icon: AlertTriangle,
        };
      case "warning":
        return {
          iconClass:
            "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
          Icon: AlertCircle,
        };
      case "info":
      default:
        return {
          iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
          Icon: Info,
        };
    }
  };

  const { iconClass, Icon } = getVariantStyles();

  const shouldPreventClose =
    isLoading ||
    (options.preventCloseOnOutsideClick && isOpen) ||
    (options.preventCloseOnEscape && isOpen);

  return (
    <ConfirmContext.Provider value={{ confirm, isOpen, isLoading }}>
      {children}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !shouldPreventClose) {
            handleCancel();
          }
        }}
      >
        <DialogContent
          removeClose
          className="w-[calc(100%-2rem)] sm:w-full sm:max-w-md p-6 gap-4"
          onInteractOutside={(e) => {
            if (shouldPreventClose || options.preventCloseOnOutsideClick) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (shouldPreventClose || options.preventCloseOnEscape) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}
              >
                <Icon size={24} />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <DialogTitle>
                  {options.title || "Are you absolutely sure?"}
                </DialogTitle>

                {options.description && (
                  <DialogDescription className="wrap-break-word">
                    {options.description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2 sm:pt-0">
            <DialogClose asChild>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outline"
                size={"sm"}
                className="order-2 sm:order-1 w-full sm:w-auto sm:min-w-[88px]"
              >
                {isLoading && options.showLoadingOnCancel ? (
                  <ClipLoader size={15} color="currentColor" />
                ) : (
                  options.cancelText || "Cancel"
                )}
              </Button>
            </DialogClose>

            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              size={"sm"}
              className="order-1 sm:order-2 w-full sm:w-auto sm:min-w-[88px]"
            >
              {isLoading && options.showLoadingOnConfirm !== false ? (
                <ClipLoader size={15} color="white" />
              ) : (
                options.confirmText || "Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
