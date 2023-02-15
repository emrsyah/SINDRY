import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/adminDetail.scss";
import { Customer, OutletListType, Outlet, genderOptions, Gender } from "@/dataStructure";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Select from "react-select";

const PelangganDetail = () => {
  const { id } = useParams();
  const [customerD, setCustomerD] = useState<Customer>();
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);

  const { register, handleSubmit } = useForm<Customer>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // connectionSql.connect();
    const sqlSt = `SELECT * FROM customers WHERE id = ${id}`;
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(`${sqlSt}; ${outletSt}`, (err, results, fields) => {
      if (err) console.error(err);
      else {
        const dataReturn: Customer = results[0][0];
        const outletReturn = results[1];
        const selected = outletReturn.filter(
          (obj: Outlet) => obj.id == dataReturn.outlet_id
        )[0];
        const genderSelected = genderOptions.filter(
          (obj: Gender) => obj.value == dataReturn.gender
        )[0];
        setCustomerD(dataReturn);
        setOutlets(outletReturn);
        setSelectedOutlet(selected);
        setSelectedGender(genderSelected);
        setLoading(false);
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    const updateSt = `UPDATE customers SET name = '${data.name}', address = '${data.address}', contact = '${data.contact}', outlet_id = '${selectedOutlet?.id}', gender = '${selectedGender.value}' WHERE id = ${id}`;
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
        <h2>Detail Pelanggan</h2>
        <button>Simpan Perubahan</button>
      </div>
      <div className="formContainerDetail">
        <div className="formSub">
          <h5>Nama</h5>
          <input
            type="text"
            defaultValue={customerD?.name}
            required
            {...register("name")}
          />
        </div>
        <div className="formSub">
          <h5>Contact</h5>
          <input
            type="text"
            defaultValue={customerD?.contact}
            {...register("contact")}
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

        <div className="formSub">
          <h5>Alamat</h5>
          {/* <textarea name="" id=""></textarea> */}
          <input
            type="text"
            defaultValue={customerD?.address}
            {...register("address")}
          />
        </div>

        <div className="formSub disabledInput">
          <h5>Ditambahkan Pada</h5>
          <input
            type="text"
            disabled
            value={dayjs(customerD?.created_at).format("DD MMM YYYY")}
          />
        </div>
      </div>
    </form>
  );
};

export default PelangganDetail;
