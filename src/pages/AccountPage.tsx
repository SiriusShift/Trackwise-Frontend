import PageHeader from "@/shared/components/PageHeader";
import { Tabs } from "@/shared/components/ui/tabs";
import React from "react";
const AccountPage = () => {
  return (
    <>
      {" "}
      <div className="flex p-5 flex-col gap-5">
        <PageHeader
          pageName={"Accounts"}
          description={"Manage and track your accounts"}
          monthPicker={false}
        />
      </div>
    </>
  );
};

export default AccountPage;
