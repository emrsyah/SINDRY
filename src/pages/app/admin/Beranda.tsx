import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/beranda.scss";
import { connectionSql } from "@/sqlConnect";
import rupiahConverter from "../../../helpers/rupiahConverter";
import { LineChart } from "@/components/LineChart";
import { TransactionListType } from "../../../dataStructure";
import { PieChart } from "@/components/PieChart";

export interface ProductDashboard {
  name: string;
  total_sales: number;
}
export interface OutletDashboard {
  name: string;
  total_sales: number;
}

const Beranda = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionListType>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [products, setProducts] = useState<ProductDashboard[]>([]);
  const [topProducts, setTopProducts] = useState<ProductDashboard[]>([]);
  const [outlets, setOutlets] = useState<OutletDashboard[]>([]);

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
      "SELECT name, sold AS total_sales FROM products ORDER BY total_sales desc";
    const outletSalesQ =
      "SELECT name, total_sales FROM outlets ORDER BY total_sales desc";
    const transactionsQ =
      "SELECT * FROM transactions WHERE MONTH(created_at)=MONTH(now()) ORDER BY created_at DESC LIMIT 5";
    // const transactionsPerWeek =
    //   "SELECT WEEK(created_at) AS week, SUM(total) AS weekly_total  FROM transactions WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) GROUP BY week";
    // const countTransaksiQ = "SELECT * FROM transactions WHERE MONTH(order_date)=MONTH(now())"
    connectionSql.query(
      `${totalQ}; ${countTransaksiQ}; ${favoriteProductsQ}; ${outletSalesQ}; ${transactionsQ};`,
      (err, results, fields) => {
        if (err) console.error(err);
        else {
          // console.log(results[0][0].total)
          const top3 = results[2].slice(0, 3);
          setTotalSales(results[0][0].total);
          setTotalTransactions(results[1][0].jumlah);
          setProducts(results[2]);
          setTopProducts(top3);
          setOutlets(results[3]);
          setTransactions(results[4]);
        }
      }
    );
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
          <h4>{rupiahConverter(totalSales)}</h4>
        </div>
        <div className="berandaSub1">
          <h5>Jumlah Transaksi</h5>
          <h4>{totalTransactions}</h4>
        </div>
        <div className="berandaSub1">
          <h5>Paket Favorit</h5>
          <h4>{products[0]?.name}</h4>
        </div>
      </div>

      <div className="berandaDiv2">
        <div className="berandaSub2 berandaSub2Stat">
          <LineChart submitted={transactions} />
        </div>
        <div className="berandaSub2 berandaSub2List">
          <h4>Paket Laris 🏆</h4>
          <div className="berandaSub2ListItem">
            {topProducts.map((p, i) => (
              <div className="berandaSub2ListItemDetail">
                <p>{i + 1}</p>
                <p>|</p>
                <h5>{p.name}</h5>
                <p>{p.total_sales} Terjual</p>
              </div>
            ))}
            {/* <div className="berandaSub2ListItemDetail">
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
            </div> */}
          </div>
          <button>Lihat Lainnya</button>
        </div>
      </div>

      <div className="berandaDiv3">
        <div className="berandaSub3">
          <h5>Penjualan Per Produk</h5>
          <PieChart dataP={products} />
        </div>
        <div className="berandaSub3">
          <h5>Penjualan Per Outlet</h5>
          <PieChart dataP={outlets} />
        </div>
      </div>
    </div>
  );
};

export default Beranda;
