import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import "../assets/styles/mainLayout.styles.scss";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="mainLayout__headerAndContent">
        {/* <Header /> */}
        <div className="mainLayout__headerAndContent__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;