import React from "react";
import moment from "moment";
import DefaultProfile from "../assets/images/default.png";
import { Bell, Menu, Sun } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "./mode-toggle";
const Header = () => {
  return (
    <div className="flex lg:ms-[265px] border-b-2  items-center justify-between">
      <div className="flex w-full justify-between py-3 px-6">
        <div className="flex items-center gap-5">
          <Menu className="inline lg:hidden" />
          <p className="text-xl">Dashboard</p>
          {/* <p>{moment().format("MMMM D, YYYY")}</p> */}
        </div>
        <div className="flex items-center gap-6 justify-between">
          <ModeToggle />
          {/* <Button variant="outline" className="w-9 h-9">
            <Sun className=" text-gray-600" />
          </Button> */}
          <Button variant="outline" className="w-9 h-9">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="h-10 w-10 bg-gray-300 rounded-full items-center justify-center flex">
            <img src={DefaultProfile} width={"20px"} alt="Profile Picture" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
