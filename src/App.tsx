import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login';
import Layout from './pages/app/Layout';
import AdminLayout from './pages/app/admin/AdminLayout';
import Beranda from './pages/app/admin/Beranda';
import Orderan from './pages/app/admin/Orderan';
import Produk from './pages/app/admin/Produk/Produk';
import Pelanggan from './pages/app/admin/Pelanggan/Pelanggan';
import Outlet from './pages/app/admin/Outlet/Outlet';
import OutletDetail from './pages/app/admin/Outlet/OutletDetail';
import OutletNew from './pages/app/admin/Outlet/OutletNew';
import PelangganDetail from './pages/app/admin/Pelanggan/PelangganDetail';
import PelangganNew from './pages/app/admin/Pelanggan/PelangganNew';
import ProdukNew from './pages/app/admin/Produk/ProdukNew';
import ProdukDetail from './pages/app/admin/Produk/ProdukDetail';


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
            <Route path='produk/:id' element={<ProdukDetail />} />
            <Route path='produk/new' element={<ProdukNew />} />
            <Route path='pelanggan' element={<Pelanggan />} />
            <Route path='pelanggan/:id' element={<PelangganDetail />} />
            <Route path='pelanggan/new' element={<PelangganNew />} />
            <Route path='outlet' element={<Outlet />} />
            <Route path='outlet/new' element={<OutletNew />} />
            <Route path='outlet/:id' element={<OutletDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App