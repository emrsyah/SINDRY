import React from "react";
import '@/styles/table.scss'


function EmptyTable({ columns }: { columns: any }) {
  return (
    <div className="emptyTable">
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
    </div>
  );
}

export default EmptyTable;
