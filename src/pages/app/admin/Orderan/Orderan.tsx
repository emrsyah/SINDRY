import React, { useEffect, useMemo } from "react";
import "@/styles/adminGeneral.scss";
import { connectionSql } from "@/sqlConnect";
import { useState } from "react";
import dayjs from "dayjs";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import { TransactionListType } from "../../../../dataStructure";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { UilCheckCircle, UilTimesCircle } from "@iconscout/react-unicons";
import transactionStatusConverter from "@/helpers/transactionStatusConverter";
import { Link } from "react-router-dom";

const Orderan = () => {
  const [transactions, setTransactions] = useState<TransactionListType>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  useEffect(() => {
    // connectionSql.connect();
    var tmpSql =
      "SELECT t.*, o.name AS outlet_name, u.name AS cashier_name, c.name AS customer_name FROM transactions t, outlets o, users u, customers c WHERE t.outlet_id = o.id AND t.cashier_id = u.id AND t.customer_id = c.id";
    connectionSql.query(tmpSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // console.log(results);
        // setProducts(results);
        setTransactions(results);
      }
    });
  }, []);

  const dataMemo = useMemo(() => transactions, [transactions]);
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <>#{value}</>
        ),
      },
      {
        Header: "Tanggal",
        accessor: "created_at",
        Cell: ({ cell: { value } }: { cell: { value: Date } }) => (
          <>{dayjs(value).format("DD MMM")}</>
        ),
        // Cell: ({ cell: { value } }: { cell: { value: "kiloan" | "bed_cover" | "selimut" | "kaos" | "lainnya" } }) => (
        //   <span className={`${value === "bed_cover" ? "bcType" : value === "kaos" ? "kType" : value === "kiloan" ? "klType" : value === "selimut" ? "sType" : "lType"}`}>{(value)}</span>
        // ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span
            className={`${
              value === "new"
                ? "lType"
                : value === "on_process"
                ? "kType"
                : value === "finished"
                ? "sType"
                : value === "picked_up"
                ? "bcType"
                : ""
            }`}
          >
            {transactionStatusConverter(value)}
          </span>
        ),
      },
      {
        Header: "Pelanggan",
        accessor: "customer_name",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className="">{value}</span>
        ),
      },
      {
        Header: "Bayar",
        accessor: "is_paid",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <span className="paidStatus">
            {value === 1 ? (
              <>
                <UilCheckCircle size="18" className="cIcon" />
                <p>Dibayar</p>
              </>
            ) : (
              <>
                <UilTimesCircle size="18" className="xIcon" />
                <p>Belum</p>
              </>
            )}
          </span>
        ),
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <span className="">{rupiahConverter(value)}</span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="outletTitle">
        <h2>Orderan</h2>
        <button>
          <Link to={"select-outlet"}>Buat Baru</Link>
        </button>
      </div>
      <div className="filterInput">
        <input
          type="text"
          placeholder="Cari Dengan Nama"
          onChange={handleFilterChange}
          value={filterInput}
        />
      </div>
      {dataMemo.length ? (
        <Table
          columns={columns}
          data={dataMemo}
          filterColumn="id"
          filterInput={filterInput}
        />
      ) : (
        <EmptyTable columns={columns} />
      )}
    </div>
  );
};

export default Orderan;
