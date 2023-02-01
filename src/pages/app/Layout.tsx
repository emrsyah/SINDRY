import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'


const Layout = () => {
  // useEffect(()=>{

  // })
  return (
    <div >
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout