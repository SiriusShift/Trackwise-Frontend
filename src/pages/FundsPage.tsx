import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/common/CommonTable";
import { Expense } from "@/types";
import { expenseColumns } from "@/components/page-components/funds/expenseColumn";
import { useState, useEffect } from "react";
import useDisclosure from "@/hooks/useDisclosure";

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
      <div className="flex justify-between">
        <div>
          <p className="text-xl">{currentPageName?.name}</p>
          <p className="text-gray-400">
            This is your overview of expenses and incomes for this month
          </p>
        </div>
      </div>
      <DataTable columns={expenseColumns} data={data} />
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
