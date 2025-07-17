import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

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
    [options]
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
    console.log("test")
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
    Icon: React.ComponentType<{ size?: number }>;
  } => {
    switch (options.variant) {
      case "destructive":
        return {
          iconClass: "bg-red-100 text-red-600",
          Icon: AlertTriangle,
        };
      case "warning":
        return {
          iconClass: "bg-yellow-100 text-yellow-600",
          Icon: AlertCircle,
        };
      case "info":
      default:
        return {
          iconClass: "bg-blue-100 text-blue-600",
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
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${iconClass}`}>
                <Icon size={24} />
              </div>

              <DialogTitle>
                {options.title || "Are you absolutely sure?"}
              </DialogTitle>

              {options.description && (
                <DialogDescription>{options.description}</DialogDescription>
              )}
            </div>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outline"
                className="mr-2"
              >
                {isLoading && options.showLoadingOnCancel ? (
                  <ClipLoader size={15} color="currentColor" />
                ) : (
                  options.cancelText || "Cancel"
                )}
              </Button>
            </DialogClose>

            <Button onClick={handleConfirm} disabled={isLoading}>
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
