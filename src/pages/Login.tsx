import React from 'react'
import {Link} from 'react-router-dom'
import '../styles/login.scss'
import logo from '../assets/sindryLogos.svg'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { connectionSql } from '@/sqlConnect'

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const nav = useNavigate()

  const submitHandler = (ev: any) => {
    ev.preventDefault()
    console.log({email, password})
    // nav('/app')
    connectionSql.connect()
    var stateSql = "SELECT * from `transaksi`"
    connectionSql.query(stateSql, function(err, results, fields){
      if(err) console.error(err.code)
      else{
        console.log(results[0].harga)
      }
    })
  }

  return (
    <div className='cardGw'>
        <nav className='nav'>
            <h2>SINDRY</h2>
            <img src={logo} alt="" />
        </nav>
        <main className='main'>
            <img src={logo} alt="" />
            <h2>Selamat Datang Kembali!</h2>
            <form className="formContainer" onSubmit={submitHandler}>
                <div className='inputGroup'>
                    <h6>Email</h6>
                    <input type="text" placeholder='example@gmail.com' value={email} onChange={(ev)=>setEmail(ev.target.value)} />
                </div>
                <div className='inputGroup'>
                    <h6>Password</h6>
                    <input type="password" placeholder='your password' value={password} onChange={(ev)=>setPassword(ev.target.value)} />
                </div>
                <button type='submit'>Masuk</button>
            </form>
        </main>
    </div>
  )
}

export default Login