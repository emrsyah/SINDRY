import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Beranda = () => {
  const location= useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    const currentPath = location.pathname.split('/')
    if(currentPath.length  < 4){
        navigate('beranda')
    }
  }, [])
  return (
    <div>
        Beranda
    </div>
  )
}

export default Beranda