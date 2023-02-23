import { Outlet, OutletListType, User } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { roleOptions } from "../../../../dataStructure";
import Select from "react-select";
import sha1 from "sha1";
import { toast } from "react-toastify";

const PenggunaNew = () => {
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  const { register, handleSubmit } = useForm<User>();
  const nav = useNavigate();

  useEffect(() => {
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(outletSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        setOutlets(results);
        setSelectedOutlet(results[0]);
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    // Check if user with that username exist
    const checkSt = `SELECT * FROM users WHERE username =  '${data.username}'`;
    connectionSql.query(checkSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // Return if there is one
        if (results.length) {
          toast.error("Akun dengan username tersebut sudah ada");
          return;
        }

        // add kalo gak ada
        const sha1Pass = sha1(data.password);
        const addSt = `INSERT INTO users (id, name, username, password, outlet_id, role, created_at) VALUES (NULL, '${data.name}', '${data.username}', '${sha1Pass}', '${selectedOutlet?.id}', '${selectedRole.value}', current_timestamp())`;
        console.log(addSt);
        connectionSql.query(addSt, (err, results, fields) => {
          if (err) console.error(err);
          else {
            console.log(results);
            nav(-1);
          }
        });
      }
    });
  });

  return (
    <form onSubmit={submitHandler}>
      <div className="outletTitle">
        <h2>Tambah Pengguna</h2>
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
            // defaultValue={outletD?.name}
            required
            {...register("username")}
          />
        </div>{" "}
        <div className="formSub">
          <h5>Password</h5>
          <input
            type="password"
            // defaultValue={outletD?.name}
            required
            {...register("password")}
          />
        </div>
      </div>
    </form>
  );
};

export default PenggunaNew;
