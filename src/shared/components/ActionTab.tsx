import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Pencil } from "lucide-react";

interface ActionTabProps {
  onEdit: () => void;
}

const ActionTab = ({ onEdit }: ActionTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }} // start invisible and slightly above
      animate={{
        opacity: 1, // fade in
        y: 0, // move to normal position
        transition: {
          ease: "easeInOut",
          duration: 0.25,
        },
      }}
      exit={{
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
      }}
      className="w-full border-b px-5 py-2 flex justify-end gap-2"
    >
      <Button variant="outline" onClick={onEdit}>
        <Pencil className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default ActionTab;
