import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/beranda.scss";
import { connectionSql } from "@/sqlConnect";

const Beranda = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname.split("/");
    if (currentPath.length < 4) {
      navigate("beranda");
    }
    connectionSql.connect();
    const totalQ =
      "SELECT SUM(total) AS total FROM transactions WHERE MONTH(created_at)=MONTH(now())";
    const countTransaksiQ =
      "SELECT COUNT(*) AS jumlah FROM transactions WHERE MONTH(created_at)=MONTH(now())";
    const favoriteProductsQ =
      "SELECT name, sold FROM products ORDER BY sold desc";
    const outletSalesQ =
      "SELECT name, total_sales FROM outlets ORDER BY total_sales desc";
    // const countTransaksiQ = "SELECT * FROM transactions WHERE MONTH(order_date)=MONTH(now())"
    connectionSql.query(outletSalesQ, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        // setProducts(results);
        // setTransactions(results);
      }
    });
  }, []);
  return (
    <div className="container">
      <div className="berandaHead">
        <h2>Beranda</h2>
        <h4>Bulan Ini</h4>
      </div>
      <div className="berandaDiv1">
        <div className="berandaSub1">
          <h5>Total Penjualan</h5>
          <h4>Rp 120.000</h4>
        </div>
        <div className="berandaSub1">
          <h5>Jumlah Transaksi</h5>
          <h4>17</h4>
        </div>
        <div className="berandaSub1">
          <h5>Paket Favorit</h5>
          <h4>Cuci Kiloan</h4>
        </div>
      </div>

      <div className="berandaDiv2">
        <div className="berandaSub2 berandaSub2Stat">Ini Statistik</div>
        <div className="berandaSub2 berandaSub2List">
          <h4>Paket Laris 🏆</h4>
          <div className="berandaSub2ListItem">
            <div className="berandaSub2ListItemDetail">
              <p>1</p>
              <p>|</p>
              <h5>Cuci Kiloan</h5>
              <p>23 Terjual</p>
            </div>
            <div className="berandaSub2ListItemDetail">
              <p>2</p>
              <p>|</p>
              <h5>Cuci Kiloan</h5>
              <p>20 Terjual</p>
            </div>
            <div className="berandaSub2ListItemDetail">
              <p>3</p>
              <p>|</p>
              <h5>Cuci Kiloan</h5>
              <p>17 Terjual</p>
            </div>
          </div>
          <button>Lihat Lainnya</button>
        </div>
      </div>

      <div className="berandaDiv3">
        <div className="berandaSub3">Pie Chart Paket</div>
        <div className="berandaSub3">Pie Chart Outlet</div>
      </div>
    </div>
  );
};

export default Beranda;
