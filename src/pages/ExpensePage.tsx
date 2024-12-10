import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/common/CommonTable";
import { Expense } from "@/types";
import { expenseColumns, recurringExpenseColumns } from "@/components/page-components/funds/expenseColumn";
import { useState, useEffect } from "react";
import Toolbar from "@/components/common/CommonToolbar";
import { useGetExpensesQuery } from "@/feature/expenses/api/expensesApi";
import { decryptString } from "@/utils/CustomFunctions";
import { useSelector } from "react-redux";
// import useDisclosure from "@/hooks/useDisclosure";
// import { AddDialog } from "@/components/dialog/addDialog";
// import { Button } from "@/components/ui/button";
// import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";



const WalletPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("Regular");
  const [data, setData] = useState([]);
  const userId = useSelector((state) => state?.userDetails?.id);
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  console.log(activeTab);

  const {data: expensesData} = useGetExpensesQuery({
    userId: userId,
    active: activeTab
  });
  
  console.log("data", expensesData);


  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-5">
        <div>
          <p className="text-xl">{currentPageName?.name}</p>
          <p className="text-gray-400">
            This is your overview of expenses for this month
          </p>
        </div>
        <MonthPicker />
      </div>
      <div>
        <Toolbar type={"Expense"} active={activeTab}>
          <div className="relative h-9 w-48 bg-secondary p-1 rounded-sm">
            {/* Inner Tab Container */}
            <div className="relative flex gap-1 h-full bg-secondary rounded-sm text-center items-center overflow-hidden">
              {/* Animated Active Tab Indicator */}
              <div
                className={`absolute top-0 left-0 h-full w-1/2 bg-background rounded-sm transition-all duration-300`}
                style={{
                  transform:
                    activeTab === "Regular"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              ></div>

              {/* Tab 1 */}
              <div
                onClick={() => setActiveTab("Regular")}
                className={`relative z-10 h-full flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "Regular" ? "text-primary" : "text-gray-500"
                }`}
              >
                Regular
              </div>

              {/* Tab 2 */}
              <div
                onClick={() => setActiveTab("Recurring")}
                className={`relative z-10 h-full flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "Recurring" ? "text-primary" : "text-gray-500"
                }`}
              >
                Recurring
              </div>
            </div>
          </div>
        </Toolbar>
        {activeTab === "Regular" ? (
          <DataTable columns={expenseColumns} data={expensesData || []} />
        ) : (
          <DataTable columns={recurringExpenseColumns} data={expensesData || []} />
        )}
      </div>
      <div>
        <h1 className="text-xl">Expenses limit for this month</h1>
        <div className="w-full grid grid-cols-4">
          <div className="h-28 w-full">hello</div>
          <div className="h-28 w-full">hello</div>
          <div className="h-28 w-full">hello</div>
          <div className="h-28 w-full">hello</div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
