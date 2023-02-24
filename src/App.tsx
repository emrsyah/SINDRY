import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./pages/app/Layout";
import AdminLayout from "./pages/app/admin/AdminLayout";
import Beranda from "./pages/app/admin/Beranda";
import Orderan from "./pages/app/admin/Orderan/Orderan";
import Produk from "./pages/app/admin/Produk/Produk";
import Pelanggan from "./pages/app/admin/Pelanggan/Pelanggan";
import Outlet from "./pages/app/admin/Outlet/Outlet";
import OutletDetail from "./pages/app/admin/Outlet/OutletDetail";
import OutletNew from "./pages/app/admin/Outlet/OutletNew";
import PelangganDetail from "./pages/app/admin/Pelanggan/PelangganDetail";
import PelangganNew from "./pages/app/admin/Pelanggan/PelangganNew";
import ProdukNew from "./pages/app/admin/Produk/ProdukNew";
import ProdukDetail from "./pages/app/admin/Produk/ProdukDetail";
import OrderanDetail from "./pages/app/admin/Orderan/OrderanDetail";
import OrderanNew from "./pages/app/admin/Orderan/OrderanNew";
import OrderanSelectOutlet from "./pages/app/admin/Orderan/OrderanSelectOutlet";
import Pengguna from "./pages/app/admin/Pengguna/Pengguna";
import PenggunaNew from "./pages/app/admin/Pengguna/PenggunaNew";
import PenggunaDetail from "./pages/app/admin/Pengguna/PenggunaDetail";
import OrderanEdit from "./pages/app/admin/Orderan/OrderanEdit";

const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/app" element={<Layout />}>
            <Route path="a" element={<AdminLayout />}>
              <Route index element={<Beranda />} />
              <Route path="beranda" element={<Beranda />} />
              <Route path="orderan" element={<Orderan />} />
              <Route
                path="orderan/select-outlet"
                element={<OrderanSelectOutlet />}
              />
              <Route path="orderan/new" element={<OrderanNew />} />
              <Route path="orderan/:id" element={<OrderanDetail />} />
              <Route path="orderan/:id/edit" element={<OrderanEdit />} />
              <Route path="produk" element={<Produk />} />
              <Route path="produk/:id" element={<ProdukDetail />} />
              <Route path="produk/new" element={<ProdukNew />} />
              <Route path="pelanggan" element={<Pelanggan />} />
              <Route path="pelanggan/:id" element={<PelangganDetail />} />
              <Route path="pelanggan/new" element={<PelangganNew />} />
              <Route path="outlet" element={<Outlet />} />
              <Route path="outlet/new" element={<OutletNew />} />
              <Route path="outlet/:id" element={<OutletDetail />} />
              <Route path="pengguna" element={<Pengguna />} />
              <Route path="pengguna/new" element={<PenggunaNew />} />
              <Route path="pengguna/:id" element={<PenggunaDetail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
