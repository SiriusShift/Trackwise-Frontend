import { Dialog, DialogContent } from "../ui/dialog";

const TimePicker = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog
      modal={true}
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false);
        }
      }}
    >
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default TimePicker;
