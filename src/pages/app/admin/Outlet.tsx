import React, { useEffect, useMemo } from "react";
import "@/styles/adminGeneral.scss";
import EmptyTable from "@/components/EmptyTable";
import { connectionSql } from "@/sqlConnect";
import { useState } from "react";
import { OutletListType } from "@/dataStructure";
import Table from "@/components/Table";
import dayjs from "dayjs";

const Outlet = () => {
  const [outlets, setOutlets] = useState<OutletListType[]>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  useEffect(() => {
    connectionSql.connect();
    var stateSql = "SELECT * FROM outlets";
    connectionSql.query(stateSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        setOutlets(results);
      }
    });
  }, []);

  const dataMemo = useMemo(() => outlets, [outlets]);

  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
        // Cell: ({ cell: { value } }) => (
        //   <p className={`max-w-[160px]`}>{value}</p>
        // ),
      },
      {
        Header: "Lokasi",
        accessor: "address",
        // Cell: ({ cell: { value } }) => (
        //   <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
        // ),
      },
      {
        Header: "Kontak",
        accessor: "contact",
        // Cell: ({ cell: { value } }) => (
        //   <p
        //     className={`lg:max-w-[300px] truncate md:max-w-[160px] max-w-[90px]`}
        //   >
        //     {value}
        //   </p>
        // ),
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
    <div className="">
      <div className="outletTitle">
        <h2>Outlet</h2>
        <button>Buat Baru</button>
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

export default Outlet;
