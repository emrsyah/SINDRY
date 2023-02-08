import React from "react";

function EmptyTable({ columns }: { columns: any }) {
  return (
    <>
      <table >
        <thead>
          <tr>
            {columns.map((col: any, i: number) => (
              <th  key={i}>
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <p>Belum Ada Data</p>
    </>
  );
}

export default EmptyTable;
