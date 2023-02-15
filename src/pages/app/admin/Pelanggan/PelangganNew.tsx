import { Customer, Gender, Outlet, genderOptions } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const PelangganNew = () => {
  const { register, handleSubmit } = useForm<Customer>();
  const nav = useNavigate();

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  useEffect(() => {
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(outletSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // console.log(results);
        setOutlets(results);
        setSelectedOutlet(results[0]);
        // setCustomers(results);
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    const addSt = `INSERT INTO customers (id, name, address, gender, contact, outlet_id, created_at) VALUES (NULL, '${data.name}', '${data.address}', '${selectedGender.value}', '${data.contact}', ${selectedOutlet?.id}, current_timestamp())`;
    connectionSql.query(addSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
        nav(-1);
      }
    });
  });

  return (
    <form onSubmit={submitHandler}>
      <div className="outletTitle">
        <h2>Tambah Pelanggan</h2>
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
        <div className="formSub">
          <h5>Gender</h5>
          {/* <textarea name="" id=""></textarea> */}
          <Select
            options={genderOptions}
            value={selectedGender}
            className="selectInput"
            onChange={setSelectedGender}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#646cff",
                primary: "white",
                neutral80: "white",
                neutral0: "#323232",
              },
            })}
          />
        </div>
        <div className="formSub">
          <h5>Outlet</h5>
          <Select
            options={outlets}
            value={selectedOutlet}
            className="selectInput"
            onChange={setSelectedOutlet}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#646cff",
                primary: "white",
                neutral80: "white",
                neutral0: "#323232",
              },
            })}
          />
        </div>
      </div>
    </form>
  );
};

export default PelangganNew;
