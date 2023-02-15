import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/adminDetail.scss";
import {
  OutletListType,
  Outlet,
  ProductType,
  productTypeOptions,
} from "@/dataStructure";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { Product } from "../../../../dataStructure";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatter";

const ProdukDetail = () => {
  const { id } = useParams();
  const [productD, setProductD] = useState<Product>();
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedType, setSelectedType] = useState<ProductType>(
    productTypeOptions[0]
  );
  const { register, handleSubmit } = useForm<Product>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // connectionSql.connect();
    const sqlSt = `SELECT * FROM customers WHERE id = ${id}`;
    const sqlStPr = `SELECT * FROM products WHERE id = ${id}`;
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    connectionSql.query(`${sqlStPr}; ${outletSt}`, (err, results, fields) => {
      if (err) console.error(err);
      else {
        const dataReturn: Product = results[0][0];
        const outletReturn = results[1];
        const selected = outletReturn.filter(
          (obj: Outlet) => obj.id == dataReturn.outlet_id
        )[0];
        const typeSelected = productTypeOptions.filter(
          (obj: ProductType) => obj.value == dataReturn.type
        )[0];
        setProductD(dataReturn);
        console.log(dataReturn)
        setOutlets(outletReturn);
        setSelectedOutlet(selected);
        setSelectedType(typeSelected);
        setLoading(false);
      }
    });
  }, []);

  const submitHandler = handleSubmit((data) => {
    const strPrice = data.price.toString()
    const convertedPrice = parseInt(strPrice.length < 4 ?strPrice :strPrice.split(".").join(""))
    const updateSt = `UPDATE products SET name = '${data.name}', price = '${convertedPrice}', type = '${selectedType.value}', outlet_id = '${selectedOutlet?.id}' WHERE id = ${id}`;
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
        <h2>Detail Produk</h2>
        <button>Simpan Perubahan</button>
      </div>
      <div className="formContainerDetail">
        <div className="formSub">
          <h5>Nama</h5>
          <input
            type="text"
            defaultValue={productD?.name}
            required
            {...register("name")}
          />
        </div>
        <div className="formSub">
          <h5>Harga</h5>
          <input
            type="text"
            defaultValue={productD?.price}
            {...register("price")}
            id="priceInput"
            onKeyUp={(ev) => inputRupiahFormatted(ev.target)}
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
        <div className="formSub disabledInput">
          <h5>Terjual Sebanyak</h5>
          <input
            type="text"
            disabled
            value={productD?.sold}
          />
        </div>
        <div className="formSub disabledInput">
          <h5>Ditambahkan Pada</h5>

          <input
            type="text"
            disabled
            value={dayjs(productD?.created_at).format("DD MMM YYYY")}
          />
        </div>
      </div>
    </form>
  );
};

export default ProdukDetail;
