import React, { useEffect, useMemo } from "react";
import "@/styles/adminGeneral.scss";
import { connectionSql } from "@/sqlConnect";
import { useState } from "react";
import dayjs from "dayjs";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import { UserListType } from '../../../../dataStructure';
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { Link } from "react-router-dom";

const Pengguna = () => {
  const [users, setUsers] = useState<UserListType>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  useEffect(() => {
    // connectionSql.connect();
    var stateSql =
      "SELECT products.*, outlets.name AS outlet_name FROM products JOIN outlets ON outlets.id = products.outlet_id";
    const sqlSt = "SELECT u.*, o.name AS outlet_name FROM users u, outlets o WHERE u.outlet_id = o.id"
    connectionSql.query(sqlSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        // setProducts(results);
        setUsers(results)
      }
    });
  }, []);

  const dataMemo = useMemo(() => users, [users]);
  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({
          cell: { value },
        }: {
          cell: {
            value: "admin" | "cashier" | "owner" ;
          };
        }) => (
          <span
            className={`${
              value === "admin"
                ? "kType"
                : value === "cashier"
                ? "lType"
                : "bcType"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Outlet",
        accessor: "outlet_name",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className="primaryC">{value}</span>
        ),
      },
      {
        Header: "Ditambahkan Pada",
        accessor: "created_at",
        Cell: ({ cell: { value } }: { cell: { value: Date } }) => (
          <>{dayjs(value).format("DD MMM")}</>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="outletTitle">
        <h2>Pengguna</h2>
        <button>
          <Link to={"new"}>Buat Baru</Link>
        </button>{" "}
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
          filterColumn="name"
          filterInput={filterInput}
        />
      ) : (
        <EmptyTable columns={columns} />
      )}
    </div>
  );
};

export default Pengguna;
