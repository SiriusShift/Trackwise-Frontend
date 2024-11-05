import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// import "../assets/styles/mainLayout.styles.scss";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col lg:ms-80 mx-10 w-full">
        <Header />
        <div className="h-full py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;