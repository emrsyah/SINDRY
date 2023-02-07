import React from "react";
import { Link } from "react-router-dom";
import "../styles/login.scss";
import logo from "../assets/sindryLogos.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { connectionSql } from "@/sqlConnect";
import sha1 from "sha1";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const nav = useNavigate();

  const submitHandler = (ev: any) => {
    ev.preventDefault();
    // console.log({ email, password });
    const sha1Pass = sha1(password);
    connectionSql.connect();
    var stateSql =
      "SELECT * from `users` WHERE username='" +
      email +
      "' AND password='" +
      sha1Pass +
      "'";
    // console.log(stateSql);
    connectionSql.query(stateSql, function (err, results, fields) {
      if (err) console.error(err);
      else {
        if (results.length) {
          nav("/app/a");
          console.log("ada user");
        }
      }
    });
  };

  return (
    <div className="cardGw">
      <nav className="nav">
        <h2>SINDRY</h2>
        <img src={logo} alt="" />
      </nav>
      <main className="main">
        <img src={logo} alt="" />
        <h2>Selamat Datang Kembali!</h2>
        <form className="formContainer" onSubmit={submitHandler}>
          <div className="inputGroup">
            <h6>Username</h6>
            <input
              type="text"
              placeholder="username anda"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className="inputGroup">
            <h6>Password</h6>
            <input
              type="password"
              placeholder="password anda"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <button type="submit">Masuk</button>
        </form>
      </main>
    </div>
  );
};

export default Login;
