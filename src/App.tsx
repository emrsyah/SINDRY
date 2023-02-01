import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login';
import Layout from './pages/app/Layout';
import AdminLayout from './pages/app/admin/AdminLayout';
import Beranda from './pages/app/admin/Beranda';
import Orderan from './pages/app/admin/Orderan';
import Produk from './pages/app/admin/Produk';
import Pelanggan from './pages/app/admin/Pelanggan';
import Outlet from './pages/app/admin/Outlet';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/' element={<Login />} />
        <Route path='/app' element={<Layout />} >
          <Route path='a' element={<AdminLayout />}>
            <Route index element={<Beranda />} />
            <Route path='beranda' element={<Beranda />} />
            <Route path='orderan' element={<Orderan />} />
            <Route path='produk' element={<Produk />} />
            <Route path='pelanggan' element={<Pelanggan />} />
            <Route path='outlet' element={<Outlet />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App