import { IRootState } from "@/app/store";
import OverviewWidget from "@/features/dashboard/components/widgets/OverviewWidget";
import TransactionHistory from "@/features/dashboard/components/widgets/TransactionHistory";
import { useGetStatisticsQuery } from "@/features/transactions/api/transaction";
import { navigationData } from "@/routing/navigationData";
import PageHeader from "@/shared/components/PageHeader";
import { useTheme } from "@/shared/provider/ThemeProvider";
import { formatMode } from "@/shared/utils/CustomFunctions";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DueCalendar from "../components/widgets/DueCalendar";
import ExpenseWidget from "../components/widgets/ExpenseWidget";
import IncomeWidget from "../components/widgets/IncomeWidget";
import LoanBalance from "../components/widgets/LoanWidget";
import SavingsPlan from "../components/widgets/SavingsWidget";
export const description = "Loan Payment Progress Chart";

const Dashboard = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const active = useSelector((state: IRootState) => state.active.active);
  const mode = useSelector((state: IRootState) => state.active.mode);

  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname,
  );

  const { data, isFetching } = useGetStatisticsQuery({
    startDate: active.from,
    endDate: active.to,
    mode: formatMode(mode),
  });

  // const totalVisitors = chartData1[0].bills + chartData1[0].food;

  return (
    <div className="space-y-5 p-5">
      <PageHeader
        pageName={currentPageName?.name}
        description={`Overview of Dashboard for this ${formatMode()}`}
        monthPicker={true}
      />
      <div className="flex flex-col 2xl:flex-row gap-5">
        <div className="gap-5 flex 2xl:w-full flex-col 2xl:flex-row">
          <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-rows-1 lg:grid-rows-1 gap-5 ">
              <OverviewWidget data={data} isLoading={isFetching} />
              <ExpenseWidget data={data} isLoading={isFetching} />
              <IncomeWidget data={data} isLoading={isFetching} />
              <DueCalendar />
            </div>
            <div className="gap-5 space-y-5 sm:space-y-0 sm:grid-rows-2 md:grid-rows-2 xl:grid-rows-1 sm:grid grid-cols-4 xl:grid-cols-3">
              <LoanBalance />
              <SavingsPlan />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
