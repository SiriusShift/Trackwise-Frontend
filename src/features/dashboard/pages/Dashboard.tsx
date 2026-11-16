import { IRootState } from "@/app/store";
import OverviewWidget from "@/features/dashboard/components/widgets/OverviewWidget";
import TransactionHistory from "@/features/dashboard/components/widgets/TransactionHistory";
import { useGetStatisticsQuery } from "@/features/transactions/api/transaction";
import { navigationData } from "@/routing/navigationData";
import PageHeader from "@/shared/components/PageHeader";
import usePageTour from "@/shared/tour/usePageTour";
import { formatMode } from "@/shared/utils/CustomFunctions";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BudgetWidget from "../components/widgets/BudgetWidget";
import CalendarEvents from "../components/widgets/CalendarWidget";
import ExpenseWidget from "../components/widgets/ExpenseWidget";
import IncomeWidget from "../components/widgets/IncomeWidget";
import LoanWidget from "../components/widgets/LoanWidget";
export const description = "Loan Payment Progress Chart";

const Dashboard = () => {
  const { Tour } = usePageTour("dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  const active = useSelector((state: IRootState) => state.active.active);

  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname,
  );

  const { data, isFetching } = useGetStatisticsQuery({
    startDate: active.from,
    endDate: active.to,
    mode: formatMode(),
  });

  return (
    <div className="space-y-5 p-3 sm:p-5">
      {Tour}
      <PageHeader
        data-tour="page-header"
        pageName={currentPageName?.name}
        description={`Overview of Dashboard for this ${formatMode()}`}
        monthPicker={true}
      />
      <div className="flex flex-col 2xl:flex-row gap-5">
        <div className="gap-5 flex 2xl:w-full flex-col 2xl:flex-row">
          <div className="flex w-full flex-col gap-3 sm:gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
              <OverviewWidget data={data} isLoading={isFetching} />
              <ExpenseWidget data={data} isLoading={isFetching} />
              <IncomeWidget data={data} isLoading={isFetching} />
              <LoanWidget />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-3 gap-3 sm:gap-5">
              <BudgetWidget />
              <CalendarEvents />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
