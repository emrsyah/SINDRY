import React from "react";
import "../../../styles/layout.scss";
import SidebarAdmin from "@/components/SidebarAdmin";
import { Outlet } from "react-router-dom";
import sha1 from "sha1";

const AdminLayout = () => {
  // console.log(sha1("12345678"));

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
