import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/common/CommonTable";
import { Expense } from "@/types";
import { expenseColumns, recurringExpenseColumns } from "@/components/page-components/funds/expenseColumn";
import { useState, useEffect } from "react";
import Toolbar from "@/components/common/CommonToolbar";
// import useDisclosure from "@/hooks/useDisclosure";
// import { AddDialog } from "@/components/dialog/addDialog";
// import { Button } from "@/components/ui/button";
// import { ArrowDownToLine, SlidersHorizontal } from "lucide-react";

async function getData(): Promise<Expense[]> {
  return [
    {
      id: 1,
      date: "2024-11-20",
      category: "Food",
      description: "Lunch with client",
      amount: 50,
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: 2,
      date: "2024-11-18",
      category: "Transport",
      description: "Uber to office",
      amount: 20,
      paymentMethod: "Cash",
      status: "Unpaid",
    },
    {
      id: 3,
      date: "2024-11-17",
      category: "Office Supplies",
      description: "Printer Ink",
      amount: 35,
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      id: 4,
      date: "2024-11-16",
      category: "Entertainment",
      description: "Team outing movie tickets",
      amount: 120,
      paymentMethod: "Credit Card",
      status: "Overdue",
    },
    {
      id: 5,
      date: "2024-11-15",
      category: "Travel",
      description: "Airfare for business trip",
      amount: 300,
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: 6,
      date: "2024-11-14",
      category: "Utilities",
      description: "Office electricity bill",
      amount: 150,
      paymentMethod: "Bank Transfer",
      status: "Unpaid",
    },
    {
      id: 7,
      date: "2024-11-13",
      category: "Health",
      description: "Annual health check-up",
      amount: 200,
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: 8,
      date: "2024-11-12",
      category: "Marketing",
      description: "Social media ads",
      amount: 500,
      paymentMethod: "Credit Card",
      status: "Overdue",
    },
    {
      id: 9,
      date: "2024-11-11",
      category: "Maintenance",
      description: "Office cleaning services",
      amount: 75,
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      id: 10,
      date: "2024-11-10",
      category: "Food",
      description: "Team lunch",
      amount: 200,
      paymentMethod: "Credit Card",
      status: "Unpaid",
    },
    {
      id: 11,
      date: "2024-11-09",
      category: "IT",
      description: "New laptop for developer",
      amount: 1200,
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      id: 12,
      date: "2024-11-08",
      category: "Education",
      description: "Online course subscription",
      amount: 100,
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: 13,
      date: "2024-11-07",
      category: "Office Supplies",
      description: "Notebooks and pens",
      amount: 15,
      paymentMethod: "Cash",
      status: "Unpaid",
    },
    {
      id: 4,
      date: "2024-11-06",
      category: "Transport",
      description: "Taxi to client meeting",
      amount: 25,
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: 15,
      date: "2024-11-05",
      category: "Utilities",
      description: "Water bill for office",
      amount: 90,
      paymentMethod: "Bank Transfer",
      status: "Overdue",
    },
  ];
}

const WalletPage = () => {
  const location = useLocation();
  const [type, setType] = useState<string>("Expense");
  const [activeTab, setActiveTab] = useState<string>("Expense");
  const [data, setData] = useState([]);
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };
    fetchData();
  }, []);

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
        <Toolbar type={type}>
          <div className="relative h-9 w-48 bg-secondary p-1 rounded-sm">
            {/* Inner Tab Container */}
            <div className="relative flex gap-1 h-full bg-secondary rounded-sm text-center items-center overflow-hidden">
              {/* Animated Active Tab Indicator */}
              <div
                className={`absolute top-0 left-0 h-full w-1/2 bg-background rounded-sm transition-all duration-300`}
                style={{
                  transform:
                    activeTab === "Expense"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              ></div>

              {/* Tab 1 */}
              <div
                onClick={() => setActiveTab("Expense")}
                className={`relative z-10 h-full flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "Expense" ? "text-primary" : "text-gray-500"
                }`}
              >
                Regular
              </div>

              {/* Tab 2 */}
              <div
                onClick={() => setActiveTab("Income")}
                className={`relative z-10 h-full flex items-center justify-center text-sm w-1/2 cursor-pointer ${
                  activeTab === "Income" ? "text-primary" : "text-gray-500"
                }`}
              >
                Recurring
              </div>
            </div>
          </div>
        </Toolbar>
        {activeTab === "Expense" ? (
          <DataTable columns={expenseColumns} data={data} />
        ) : (
          <DataTable columns={recurringExpenseColumns} data={data} />
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
