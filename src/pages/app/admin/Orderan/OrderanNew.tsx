import { Customer, Gender, Outlet } from "@/dataStructure";
import React, { useState } from "react";
import {
  genderOptions,
  ProductListType,
  Transaction,
} from "../../../../dataStructure";
import Select from "react-select";
import { useEffect } from "react";
import { OutletListType } from "@/dataStructure";
import { CustomerListType } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Product } from "../../../../dataStructure";

const OrderanNew = () => {
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  const {
    register: registerCustomer,
    handleSubmit: handleCustomer,
    setValue: setValCustomer,
  } = useForm<Customer>();
  const { register: registerTransaction, handleSubmit: handleTransaction } =
    useForm<Transaction>();

  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [products, setProducts] = useState<ProductListType>([]);
  const [customers, setCustomers] = useState<CustomerListType>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [params, setParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const getAllOutlet = () => {
    const tmpSql = `SELECT * FROM outlets WHERE id = '${params.get("oid")}'`;
    const cusSql = `SELECT *, id AS value, name AS label FROM customers WHERE outlet_id = '${params.get(
      "oid"
    )}'`;
    const prdSql = `SELECT *, id AS value, name AS label FROM products WHERE outlet_id = '${params.get(
      "oid"
    )}'`;
    const allSql = `${tmpSql}; ${cusSql}; ${prdSql};`;
    connectionSql.query(allSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results[1][0]);
        setSelectedOutlet(results[0][0]);
        setCustomers(results[1]);
        setProducts(results[2]);
      }
    });
  };

  useEffect(() => {
    getAllOutlet();
  }, []);

  const changeCustomerHandler = (data: Customer) => {
    console.log(selectedCustomer)
    if (data == null) {
      console.log("ini hapus");
      setValCustomer("name", "");
      setValCustomer("contact", "");
      setValCustomer("address", "");
      setSelectedGender(genderOptions[0]);
      setSelectedCustomer(null)
    } else {
      setValCustomer("name", data.name);
      setValCustomer("contact", data.contact);
      setValCustomer("address", data.address);
      const selectedGender = genderOptions.filter(
        (g) => g.value == data.gender
      );
      setSelectedGender(selectedGender[0]);
      setSelectedCustomer(data)
    }
  };

  return (
    <div>
      <div className="outletTitle">
        <h2>Buat Pesanan Baru</h2>
        <p>Outlet {selectedOutlet?.name}</p>
      </div>
      <div className="oNewContainer">
        <div className="oNewL">
          <div className="cusSec">
            <div className="cusSecTitle">
              <h4 className="primaryC oSubTitle">Informasi Pelanggan</h4>
              {/* <button className="btnSecondary">Pilih Pelanggan</button> */}
              <Select
                options={customers}
                value={selectedCustomer}
                className="selectInput"
                isClearable={true}
                onChange={changeCustomerHandler}
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
            </div>{" "}
            <div className="oFormContainer">
              <div className="formSub">
                <h5>Nama</h5>
                <input type="text" required {...registerCustomer("name")} disabled={selectedCustomer !== null} />
              </div>
              <div className="formSub">
                <h5>Kontak</h5>
                <input type="text" required {...registerCustomer("contact")} disabled={selectedCustomer !== null} />
              </div>
              <div className="formSub">
                <h5>Alamat</h5>
                <input type="text" required {...registerCustomer("address")} disabled={selectedCustomer !== null} />
              </div>
              <div className="formSub">
                <h5>Gender</h5>
                {/* <input type="text" required /> */}
                <Select
                  options={genderOptions}
                  value={selectedGender}
                  className="selectInput"
                  isDisabled={selectedCustomer !== null}
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
            </div>
          </div>

          <div className="cusSec">
            <div className="cusSecTitle">
              <h4 className="primaryC oSubTitle">Produk</h4>
              <Select
                options={products}
                value={selectedProduct}
                className="selectInput"
                onChange={setSelectedProduct}
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
              />{" "}
            </div>
          </div>

          <div className="cusSec">
            <h4 className="primaryC oSubTitle">Lainnya</h4>
            <div className="oFormContainer">
              <div className="formSub">
                <h5>Diskon</h5>
                <input type="text" required />
              </div>
              <div className="formSub">
                <h5>Biaya Tambahan</h5>
                <input type="text" required />
              </div>
              <div className="formSub">
                <h5>Pajak</h5>
                <input type="text" required />
              </div>
            </div>
          </div>
        </div>
        <div className="oNewR">
          <div className="cusSec">
            <h4 className="primaryC oSubTitle">Rincian Pesanan</h4>
            <div className="rincianContainer">
              <div className="rincianSub">
                <h5>Subtotal</h5>
                <p>Rp 0</p>
              </div>
              <div className="rincianSub">
                <h5>Diskon</h5>
                <p>Rp 0</p>
              </div>
              <div className="rincianSub">
                <h5>Pajak</h5>
                <p>Rp 0</p>
              </div>
              <div className="rincianSub">
                <h5>Biaya Tambahan</h5>
                <p>Rp 0</p>
              </div>
              <div className="rincianSubFinal">
                <h5>Total</h5>
                <p>Rp 0</p>
              </div>
              <button>Tambah Pesanan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderanNew;
