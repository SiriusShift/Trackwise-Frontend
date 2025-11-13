import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Separator } from "../../ui/separator";
import {
  formatCurrency,
  getTypeIcon,
  formatDate,
} from "@/shared/utils/CustomFunctions";
import TransactionHistory from "./TransactionHistory";
import ViewImage from "./ViewImage";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import RecurringDetails from "./RecurringInfo";
import RecurringList from "./RecurringList";

const DialogAccordion = ({ transaction }) => {
  console.log(transaction);
  const [imageOpen, setImageOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const isAuto = transaction?.recurringTemplate?.auto ? true : null;
  const list =
    transaction?.generatedExpenses ||
    transaction?.generatedIncomes ||
    transaction?.generatedTransfers;

  const handleImageOpen = (image) => {
    setPreview(image);
    setImageOpen(true);
  };

  const handleEdit = (history) => {
    setActive(history);
    setOpen(true);
  };
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      // defaultValue="item-1"
    >
      {transaction?.recurringTemplate && (
        <AccordionItem value="recurring">
          <AccordionTrigger>Repeat Settings</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <RecurringDetails details={transaction?.recurringTemplate} />
          </AccordionContent>
        </AccordionItem>
      )}

      {transaction?.transactionHistory &&
        transaction?.transactionHistory?.length > 0 && (
          <AccordionItem value="history">
            <AccordionTrigger>Transaction History</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {transaction?.transactionHistory?.map((history) => (
                <>
                  <TransactionHistory
                    setOpen={() => handleEdit(history)}
                    open={open}
                    setImageOpen={() => handleImageOpen(history.image)}
                    history={history}
                    transaction={transaction}
                  />
                </>
              ))}
              <ViewImage
                image={preview}
                open={imageOpen}
                setOpen={setImageOpen}
              />
              <TransactionDialog
                mode="edit"
                history={true}
                rowData={{
                  ...active,
                  category: transaction?.category,
                  remainingBalance: transaction?.remainingBalance,
                }}
                open={open}
                setOpen={setOpen}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      {list?.length > 0 && (
        <AccordionItem value="list">
          <AccordionTrigger>Generated {transaction?.type}s</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {list.map((history) => (
              <>
                <RecurringList
                  setOpen={() => handleEdit(history)}
                  open={open}
                  setImageOpen={() => handleImageOpen(history.image)}
                  history={history}
                  transaction={transaction}
                />
              </>
            ))}
            <ViewImage
              image={preview}
              open={imageOpen}
              setOpen={setImageOpen}
            />
            <TransactionDialog
              mode="edit"
              history={true}
              rowData={{
                ...active,
                category: transaction?.category,
                remainingBalance: transaction?.remainingBalance,
              }}
              open={open}
              setOpen={setOpen}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default DialogAccordion;
