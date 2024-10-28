import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// import "../assets/styles/mainLayout.styles.scss";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col ms-28 xl:ms-80  mx-10 lg:w-[90%] xl:w-[76%]">
        <Header />
        <div className="h-full py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;