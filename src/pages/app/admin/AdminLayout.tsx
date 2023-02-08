import React from "react";
import "../../../styles/layout.scss";
import SidebarAdmin from "@/components/SidebarAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

  return (
    <div className="layoutContainer">
      <nav>
        <SidebarAdmin />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
