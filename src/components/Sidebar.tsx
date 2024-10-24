import { useState } from "react";
import Logo from "../assets/images/Logo.svg";
import Dashboard from "../assets/images/Dashboard.svg";
import Loan from "../assets/images/Loan Icon.svg";
import {
  Wallet,
  HandCoins,
  LayoutGrid,
  Landmark,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const router = useNavigate();
  return (
    <div className="w-[280px] h-full min-h-svh  p-5 pt-2 border-r-2">
      <div className="flex ms-2 mt-5">
        <img src={Logo} width={"27px"} alt="trackwise logo" />
        <h1 className="text-lg ml-4">Trackwise</h1>
      </div>
      <div className="flex mt-12 flex-col justify-between h-[580px]">
        <div className="gap-3 flex flex-col">
          <Button
            size={"lg"}
            variant={active === "dashboard" ? "default" : "ghost"}
            onClick={() => {
              setActive("dashboard");
              router("/");
            }}
            className="flex text-md p-3 justify-start w-full"
          >
            <LayoutGrid
              style={{ width: "25px", height: "25px" }}
              className="mr-3"
            />
            Dashboard
          </Button>
          <Button
            size={"lg"}
            variant={active === "wallet" ? "default" : "ghost"}
            className="flex text-md p-3 justify-start w-full"
            onClick={() => {
              setActive("wallet");
              router("/wallet");
            }}
          >
            <Wallet
              style={{ width: "25px", height: "25px" }}
              className="mr-3"
            />{" "}
            Wallet
          </Button>
          <Button
            size={"lg"}
            variant={active === "loan" ? "default" : "ghost"}
            className="flex text-md p-3 justify-start w-full"
            onClick={() => {
                setActive("loan");
                router("/loan");
              }}
          >
            <Landmark
              style={{ width: "25px", height: "25px" }}
              className="mr-3"
            />{" "}
            Loan
          </Button>
          <Button
            size={"lg"}
            variant={active === "savings" ? "default" : "ghost"}
            className="flex text-md p-3 justify-start w-full"
            onClick={() => {
                setActive("savings");
                router("/savings");
              }}
          >
            <HandCoins
              style={{ width: "25px", height: "25px" }}
              className="mr-3"
            />{" "}
            Savings
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Button
              size={"lg"}
              variant={active === "settings" ? "default" : "ghost"}
              className="flex text-md p-3 justify-start w-full"
              onClick={() => {
                setActive("settings");
                router("/settings");
              }}
            >
              <Settings
                style={{ width: "25px", height: "25px" }}
                className="mr-3"
              />{" "}
              Settings
            </Button>
          </div>
          <div>
            <Button
              size={"lg"}
              variant={"ghost"}
              className="flex text-md p-3 justify-start w-full"
            >
              <LogOut
                style={{ width: "25px", height: "25px" }}
                className="mr-3"
              />{" "}
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
