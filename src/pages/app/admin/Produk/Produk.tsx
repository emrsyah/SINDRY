import React, { useEffect, useMemo } from "react";
import "@/styles/adminGeneral.scss";
import { connectionSql } from "@/sqlConnect";
import { useState } from "react";
import dayjs from "dayjs";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import { ProductListType } from "../../../../dataStructure";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { Link } from "react-router-dom";

const Produk = () => {
  const [products, setProducts] = useState<ProductListType>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  useEffect(() => {
    // connectionSql.connect();
    var stateSql =
      "SELECT products.*, outlets.name AS outlet_name FROM products JOIN outlets ON outlets.id = products.outlet_id";
    connectionSql.query(stateSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // console.log(results);
        setProducts(results);
      }
    });
  }, []);

  const dataMemo = useMemo(() => products, [products]);
  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Tipe",
        accessor: "type",
        Cell: ({
          cell: { value },
        }: {
          cell: {
            value: "kiloan" | "bed_cover" | "selimut" | "kaos" | "lainnya";
          };
        }) => (
          <span
            className={`${
              value === "bed_cover"
                ? "bcType"
                : value === "kaos"
                ? "kType"
                : value === "kiloan"
                ? "klType"
                : value === "selimut"
                ? "sType"
                : "lType"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Harga",
        accessor: "price",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <span className="">{rupiahConverter(value)}</span>
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
        <h2>Produk</h2>
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

export default Produk;
