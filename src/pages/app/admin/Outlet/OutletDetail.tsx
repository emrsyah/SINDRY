import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/adminDetail.scss";
import { Outlet } from "@/dataStructure";
import dayjs from "dayjs";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { useForm } from "react-hook-form";

const OutletDetail = () => {
  const { id } = useParams();
  const [outletD, setOutletD] = useState<Outlet>();
  const { register, handleSubmit } = useForm<Outlet>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // connectionSql.connect();
    const sqlSt = `SELECT * FROM outlets WHERE id = ${id}`;
    connectionSql.query(sqlSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results[0]);
        const dataReturn: Outlet = results[0];
        setOutletD(dataReturn);
        setLoading(false);
        // register("name", dataReturn.name)
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    const updateSt = `UPDATE outlets SET name = '${data.name}', address = '${data.address}', contact = '${data.contact}' WHERE id = ${id}`;
    // connectionSql.connect();
    console.log(updateSt)
    connectionSql.query(updateSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
      }
    });
  });

  if (loading) return <>Loading...</>;

  return (
    <form onSubmit={submitHandler}>
      <div className="outletTitle">
        <h2>Detail Outlet</h2>
        <button>Simpan Perubahan</button>
      </div>
      <div className="formContainerDetail">
        <div className="formSub">
          <h5>Nama</h5>
          <input
            type="text"
            defaultValue={outletD?.name}
            required
            {...register("name")}
          />
        </div>
        <div className="formSub">
          <h5>Contact</h5>
          <input
            type="text"
            defaultValue={outletD?.contact}
            {...register("contact")}
          />
        </div>
        <div className="formSub alamatForm">
          <h5>Alamat</h5>
          {/* <textarea name="" id=""></textarea> */}
          <input
            type="text"
            defaultValue={outletD?.address}
            {...register("address")}
          />
        </div>
        <div className="formSub disabledInput">
          <h5>Dibuat Pada</h5>
          <input
            type="text"
            disabled
            value={dayjs(outletD?.created_at).format("DD MMM YYYY")}
          />
        </div>
        <div className="formSub disabledInput">
          <h5>Total Penjualan</h5>
          <input
            type="text"
            disabled
            value={
              outletD?.total_sales === undefined
                ? outletD?.total_sales
                : rupiahConverter(outletD.total_sales)
            }
          />
        </div>
      </div>
    </form>
  );
};

export default OutletDetail;
