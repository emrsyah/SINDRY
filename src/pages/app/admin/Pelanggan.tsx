import React, { useEffect, useMemo } from "react";
import "@/styles/adminGeneral.scss";
import { connectionSql } from "@/sqlConnect";
import { useState } from "react";
import { CustomerListType } from "@/dataStructure";
import dayjs from "dayjs";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";

const Pelanggan = () => {
  const [customers, setCustomers] = useState<CustomerListType>([]);

  useEffect(() => {
    connectionSql.connect();
    var stateSql =
      "SELECT customers.*, outlets.name AS outlet_name FROM customers JOIN outlets ON outlets.id = customers.outlet_id";
    connectionSql.query(stateSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        setCustomers(results);
      }
    });
  }, []);

  const dataMemo = useMemo(() => customers, [customers]);
  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Alamat",
        accessor: "address",
      },
      {
        Header: "Kontak",
        accessor: "contact",
      },
      {
        Header: "Outlet",
        accessor: "outlet_name",
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
        <h2>Pelanggan</h2>
        <button>Tambah Baru</button>
      </div>
      {dataMemo.length ? (
        <Table
          columns={columns}
          data={dataMemo}
          filterColumn="name"
          filterInput=""
        />
      ) : (
        <EmptyTable columns={columns} />
      )}
    </div>
  );
};

export default Pelanggan;
