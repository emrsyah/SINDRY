import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatter";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Product,
  ProductType,
  productTypeOptions,
} from "../../../../dataStructure";
import { Outlet } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";

const ProdukNew = () => {
  const { register, handleSubmit } = useForm<Customer>();
  const nav = useNavigate();

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedType, setSelectedType] = useState<ProductType>(
    productTypeOptions[0]
  );

  useEffect(() => {
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(outletSt, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // console.log(results);
        setOutlets(results);
        setSelectedOutlet(results[0]);
      }
    });
  }, []);


  const submitHandler = handleSubmit((data) => {
    const convertedPrice = parseInt(data.price.length < 4 ? data.price : data.price.split(".").join(""))
    // console.log(selectedOutlet)
    // console.log(selectedType)
    const addSt = `INSERT INTO products (id, outlet_id, name, type, price, sold, created_at) VALUES (NULL,  ${selectedOutlet?.id}, '${data.name}', '${selectedType.value}',  '${convertedPrice}', 0, current_timestamp())`;
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
        <h2>Tambah Produk</h2>
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
          <h5>Harga</h5>
          <input
            type="text"
            id="priceInput"
            onKeyUp={(ev) => inputRupiahFormatted(ev.target)}
            required
            {...register("price")}
          />
        </div>
        <div className="formSub">
          <h5>Tipe Produk</h5>
          <Select
            options={productTypeOptions}
            value={selectedType}
            className="selectInput"
            onChange={setSelectedType}
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

export default ProdukNew;
