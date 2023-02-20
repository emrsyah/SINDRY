import { OutletListType } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import React, { useEffect, useState } from "react";
import { UilStoreAlt } from "@iconscout/react-unicons";
import { useNavigate } from 'react-router-dom';

const OrderanSelectOutlet = () => {
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate()

  useEffect(() => {
    // connectionSql.connect();
    var tmpSql = "SELECT * FROM outlets";
    connectionSql.query(tmpSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // console.log(results);
        // setProducts(results);
        setOutlets(results);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div>
      <div className="outletTitle">
        <h2>Pilih Outlet</h2>
      </div>
      <div className="outletList">
        {loading ? (
          <>Mengambil Data...</>
        ) : (
          outlets.map((d, i) => (
            <div className="outletItem" key={d.id} onClick={()=>nav(`/app/a/orderan/new?oid=${d.id}`)}>
              <div className="outletIcon">
                <UilStoreAlt size="18" />
              </div>
              <p>{d.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderanSelectOutlet;
