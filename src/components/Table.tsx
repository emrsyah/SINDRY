// Table.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   // UilPen,
//   // UilTrashAlt,
//   UilAngleRight,
//   UilAngleLeft,
// } from "@iconscout/react-unicons";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";

export default function Table({ columns, data, filterInput, filterColumn } : {columns: any, data: any, filterInput: string, filterColumn: string}) {
  const navigate = useNavigate();

  // Table component logic and UI come here
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination);

  useEffect(() => {
    const value = filterInput || "";
    setFilter(filterColumn, value);
  }, [filterInput]);

  const rowClickHandler = (id:number) => {
    // navigate(id);
  };

  return (
    <>
      <table
        {...getTableProps()}
        className=" border-collapse overflow-auto rounded-xl borderin bg-white text-sm w-full text-left"
      >
        <thead className="bg-slate-100">
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="font-semibold rounded-sm text-gray-500 p-3"
                >
                  {column.render("Header")}{" "}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? //   <Icon
                        //     icon="ant-design:caret-down-filled"
                        //     className="inline"
                        //   />
                        "v"
                      : //   <Icon
                        //     icon="ant-design:caret-up-filled"
                        //     className="inline"
                        //   />
                        "^"
                    : ""}
                </th>
              ))}
              {/* <th className="font-semibold rounded-sm text-gray-500 p-2">
                Aksi
              </th> */}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="border-y-[1px] font-medium border-gray-300 cursor-pointer hover:bg-blue-50"
                onClick={() => rowClickHandler(row.original.id)}
              >
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()} className="p-3">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
                {/* <td className="flex items-center gap-4 p-3 text-gray-500">
                  <UilPen size="22" className="hover:text-blue-500" />
                  <UilTrashAlt size="22" className="hover:text-blue-500" />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-3 items-center justify-end mt-6 mb-2 mx-2 paginasiNav">
        <button disabled={!canPreviousPage} onClick={() => previousPage()}>
          {/* <Icon
            icon="cil:chevron-circle-left-alt"
            width="28"
            className={`${
              !canPreviousPage
                ? "opacity-40 cursor-auto"
                : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {/* <UilAngleLeft
            size="24"
            className={`${
              !canPreviousPage
                ? "opacity-40 cursor-auto"
                : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {"<"}
        </button>
        <p className="font-medium text-gray-500">
          <span className="text-blue-700">{pageIndex + 1}</span> dari{" "}
          {pageOptions.length}
        </p>
        <button disabled={!canNextPage} onClick={() => nextPage()}>
          {/* <Icon
            icon="cil:chevron-circle-right-alt"
            width="28"
            className={`${
              !canNextPage ? "opacity-40 cursor-auto" : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {/* <UilAngleRight
            size="24"
            className={`${
              !canNextPage
                ? "opacity-40 cursor-auto"
                : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {">"}
        </button>
      </div>
    </>
  );
}
