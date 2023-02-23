import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/adminDetail.scss";
import {
  Customer,
  OutletListType,
  Outlet,
  genderOptions,
  Gender,
  User,
  roleOptions,
  Role,
} from "@/dataStructure";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Select from "react-select";

const PenggunaDetail = () => {
  const { id } = useParams();
  const [userD, setUserD] = useState<User>();
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  const { register, handleSubmit } = useForm<User>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const sqlSt = `SELECT * FROM users WHERE id = ${id}`;
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(`${sqlSt}; ${outletSt}`, (err, results, fields) => {
      if (err) console.error(err);
      else {
        const dataReturn: User = results[0][0];
        const outletReturn = results[1];
        const selected = outletReturn.filter(
          (obj: Outlet) => obj.id == dataReturn.outlet_id
        )[0];
        const roleSelected = roleOptions.filter(
          (obj: Role) => obj.value == dataReturn.role
        )[0];
        setUserD(dataReturn);
        setOutlets(outletReturn);
        setSelectedOutlet(selected);
        setSelectedRole(roleSelected);
        setLoading(false);
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    const uptSt = `UPDATE users SET name = '${data.name}', username = '${data.username}', outlet_id = '${selectedOutlet?.id}', role = '${selectedRole.value}' WHERE users.id = ${id}`
    connectionSql.query(uptSt, (err, results, fields) => {
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
            defaultValue={userD?.name}
            required
            {...register("name")}
          />
        </div>
        <div className="formSub">
          <h5>Role</h5>
          <Select
            options={roleOptions}
            value={selectedRole}
            className="selectInput"
            onChange={setSelectedRole}
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
        <div className="formSub alamatForm">
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
          <h5>Username</h5>
          <input
            type="text"
            defaultValue={userD?.username}
            required
            {...register("username")}
          />
        </div>
        <div className="formSub disabledInput">
          <h5>Ditambahkan Pada</h5>
          <input
            type="text"
            disabled
            value={dayjs(userD?.created_at).format("DD MMM YYYY")}
          />
        </div>
      </div>
    </form>
  );
};

export default PenggunaDetail;
