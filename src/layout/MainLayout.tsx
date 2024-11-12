import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// import "../assets/styles/mainLayout.styles.scss";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="h-full lg:ms-72 mx-5 py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;