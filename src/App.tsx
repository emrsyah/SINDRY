import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login';
import Layout from './pages/app/Layout';
import AdminLayout from './pages/app/admin/AdminLayout';
import Beranda from './pages/app/admin/Beranda';


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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App