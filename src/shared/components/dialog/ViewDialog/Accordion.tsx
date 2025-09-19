import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Separator } from "../../ui/separator";
import { formatCurrency, getTypeIcon, formatDate } from "@/shared/utils/CustomFunctions";
import TransactionHistory from "./TransactionHistory";

const DialogAccordion = ({transaction, getTypeIcon, setImageOpen}) => {
  console.log(transaction)
  const isAuto = transaction?.recurringTemplate?.auto ? true : null;
  console.log(isAuto)
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      // defaultValue="item-1"
    >
      <Separator />
      {transaction.transactionHistory &&
        transaction.transactionHistory.length > 0 && (
          <AccordionItem value="item-1">
            <AccordionTrigger>Transaction History</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {transaction.transactionHistory.map((history) => (
                <TransactionHistory isAuto={isAuto} setImageOpen={setImageOpen} history={history} getTypeIcon={getTypeIcon}/>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
    </Accordion>
  );
};

export default DialogAccordion;
