import { navigationData } from "@/navigation/navigationData";
import { useLocation } from "react-router-dom";
import MonthPicker from "@/components/datePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/common/CommonTable";
import { Payment, columns } from "@/components/columns/fundsColumns";
import { useState, useEffect } from "react";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "user1@example.com",
    },
    {
      id: "a52c1d89",
      amount: 200,
      status: "success",
      email: "user2@example.com",
    },
    {
      id: "c13f7ab0",
      amount: 150,
      status: "failed",
      email: "user3@example.com",
    },
    {
      id: "9d84b5f3",
      amount: 120,
      status: "processing",
      email: "user4@example.com",
    },
    {
      id: "15c8a2f6",
      amount: 300,
      status: "pending",
      email: "user5@example.com",
    },
    {
      id: "64afdb42",
      amount: 250,
      status: "success",
      email: "user6@example.com",
    },
    {
      id: "d72c48bf",
      amount: 400,
      status: "failed",
      email: "user7@example.com",
    },
    {
      id: "e31b9d7a",
      amount: 175,
      status: "processing",
      email: "user8@example.com",
    },
    {
      id: "f24c65ad",
      amount: 90,
      status: "pending",
      email: "user9@example.com",
    },
    {
      id: "bc781e4d",
      amount: 500,
      status: "success",
      email: "user10@example.com",
    },
  ];
}

const WalletPage = () => {
  const location = useLocation();
  const [data, setData] = useState<Payment[]>([]);
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
        <div>
          <MonthPicker />
        </div>
      </div>
      <div className="flex justify-between">
        <DataTable columns={columns} data={data} />
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
