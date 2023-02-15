import { Outlet } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const OutletNew = () => {
  const { register, handleSubmit } = useForm<Outlet>();
  const nav = useNavigate()

  const submitHandler = handleSubmit((data) => {
    const addSt = `INSERT INTO outlets (id, name, address, contact, total_sales, created_at) VALUES (NULL, '${data.name}', '${data.address}', '${data.contact}', '', current_timestamp())`;
    console.log(addSt);
    connectionSql.query(addSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        nav(-1)
      }
    });
  });

  return (
    <form onSubmit={submitHandler}>
      <div className="outletTitle">
        <h2>Tambah Outlet</h2>
        <button>Simpan Data</button>
      </div>
      <div className="formContainerDetail">
        <div className="formSub">
          <h5>Nama</h5>
          <input
            type="text"
            // defaultValue={outletD?.name}
            required
            {...register("name")}
          />
        </div>
        <div className="formSub">
          <h5>Contact</h5>
          <input
            type="text"
            // defaultValue={outletD?.contact}
            {...register("contact")}
          />
        </div>
        <div className="formSub alamatForm">
          <h5>Alamat</h5>
          {/* <textarea name="" id=""></textarea> */}
          <input
            type="text"
            // defaultValue={outletD?.address}
            {...register("address")}
          />
        </div>
      </div>
    </form>
  );
};

export default OutletNew;
