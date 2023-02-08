import React, { useMemo } from "react";
import "@/styles/adminOutlet.scss";
import EmptyTable from "@/components/EmptyTable";

const Outlet = () => {
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
        Header: "Harga",
        accessor: "price",
        // Cell: ({ cell: { value } }) => (
        //   <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
        // ),
      },
      {
        Header: "Tipe",
        accessor: "desc",
        // Cell: ({ cell: { value } }) => (
        //   <p
        //     className={`lg:max-w-[300px] truncate md:max-w-[160px] max-w-[90px]`}
        //   >
        //     {value}
        //   </p>
        // ),
      },
      {
        Header: "Outlet",
        accessor: "active",
      },
      {
        Header: "Ditambahkan",
        accessor: "tanggal",
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
      <div className="emptyTable">
        <EmptyTable columns={columns} />
      </div>
    </div>
  );
};

export default Outlet;
