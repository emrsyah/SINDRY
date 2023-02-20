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
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { UilTrashAlt } from "@iconscout/react-unicons";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatter";

interface AddedProductProps extends Product {
  quantity: number;
}

interface OrderanNewProps extends Customer, Transaction {}

const OrderanNew = () => {
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  // const {
  //   register: registerCustomer,
  //   handleSubmit: handleCustomer,
  //   setValue: setValCustomer,
  // } = useForm<Customer>();
  // const { register: registerTransaction, handleSubmit: handleTransaction } =
  //   useForm<Transaction>();

  const { register, handleSubmit, getValues, setValue } =
    useForm<OrderanNewProps>();

  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [products, setProducts] = useState<ProductListType>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductListType>([]);
  const [customers, setCustomers] = useState<CustomerListType>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [params, setParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProducts, setAddedProducts] = useState<AddedProductProps[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [additionalCost, setAdditionalCost] = useState<number>(0);

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
        setFilteredProducts(results[2]);
      }
    });
  };

  useEffect(() => {
    getAllOutlet();
  }, []);

  const getSubTotal = (): number => {
    let subtotal = 0;
    for (let i = 0; i < addedProducts.length; i++) {
      subtotal += addedProducts[i].price * addedProducts[i].quantity;
    }
    return subtotal;
  };

  const getDiscount = (): number => {
    return getSubTotal() * discount / 100
  }

  const getTaxes = (): number => {
    return (getSubTotal() - getDiscount()) * taxes / 100
  }

  const changeCustomerHandler = (data: Customer) => {
    console.log(selectedCustomer);
    if (data == null) {
      console.log("ini hapus");
      setValue("name", "");
      setValue("contact", "");
      setValue("address", "");
      setSelectedGender(genderOptions[0]);
      setSelectedCustomer(null);
    } else {
      setValue("name", data.name);
      setValue("contact", data.contact);
      setValue("address", data.address);
      const selectedGender = genderOptions.filter(
        (g) => g.value == data.gender
      );
      setSelectedGender(selectedGender[0]);
      setSelectedCustomer(data);
    }
  };

  const quantityChangeHandler = (n: number, id: number) => {
    const tmpCurrent = [...addedProducts];
    const itemToUpdate = tmpCurrent.find((p) => p.id == id);
    itemToUpdate!.quantity += n;
    setAddedProducts(tmpCurrent);
  };

  const deleteProductHandler = (id: number) => {
    const tmpCurrent = [...addedProducts];
    const deletedItem = tmpCurrent.find((p) => p.id === id);
    const tmpNew = tmpCurrent.filter((p) => p.id !== id);
    setAddedProducts(tmpNew);
    setFilteredProducts((current) => [...current, deletedItem!]);
  };

  const addProductHandler = (data: Product) => {
    const tmpNewFiltered = filteredProducts.filter((p) => p.id !== data.id);
    setFilteredProducts(tmpNewFiltered);
    setAddedProducts((current) => [...current, { ...data, quantity: 1 }]);
  };

  const submitHandler = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div>
      <div className="outletTitle">
        <h2>Buat Pesanan Baru</h2>
        <p>Outlet {selectedOutlet?.name}</p>
      </div>
      <form onSubmit={submitHandler} className="oNewContainer">
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
                <input
                  type="text"
                  required
                  {...register("name")}
                  disabled={selectedCustomer !== null}
                />
              </div>
              <div className="formSub">
                <h5>Kontak</h5>
                <input
                  type="text"
                  required
                  {...register("contact")}
                  disabled={selectedCustomer !== null}
                />
              </div>
              <div className="formSub">
                <h5>Alamat</h5>
                <input
                  type="text"
                  required
                  {...register("address")}
                  disabled={selectedCustomer !== null}
                />
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
                options={filteredProducts}
                value={null}
                className="selectInput"
                onChange={addProductHandler}
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
            {addedProducts.length ? (
              <div className="productList">
                {addedProducts.map((d, i) => (
                  <div className="productItem">
                    <div className="productItemTitle">{d.name}</div>
                    <div className="productItemQuantity">
                      <button
                        disabled={d.quantity < 2}
                        onClick={() => quantityChangeHandler(-1, d.id)}
                      >
                        -
                      </button>
                      <p>{d.quantity}</p>
                      <button onClick={() => quantityChangeHandler(1, d.id)}>
                        +
                      </button>
                    </div>
                    <div className="productItemTotal">
                      {rupiahConverter(d.price * d.quantity)}
                    </div>
                    <div
                      onClick={() => deleteProductHandler(d.id)}
                      className="productItemIcon"
                    >
                      <UilTrashAlt size="20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="cusSec">
            <h4 className="primaryC oSubTitle">Lainnya</h4>
            <div className="oFormContainer">
              <div className="formSub">
                <h5>
                  Diskon <span>(dalam persen)</span>
                </h5>
                <input
                  type="number"
                  max={100}
                  min={0}
                  value={discount}
                  onChange={(ev) => setDiscount(ev.target.valueAsNumber)}
                  />
              </div>
              <div className="formSub">
                <h5>
                  Pajak <span>(dalam persen)</span>
                </h5>
                <input
                  type="number"
                  max={100}
                  min={0}
                  value={taxes}
                  onChange={(ev) => setTaxes(ev.target.valueAsNumber)}
                />
              </div>
              <div className="formSub">
                <h5>Biaya Tambahan</h5>
                <input
                  type="number"
                  defaultValue={0}
                  // onKeyUp={(ev) => inputRupiahFormatted(ev.target)}
                  // {...register("additional_cost")}
                  value={additionalCost}
                  onChange={(ev) => setAdditionalCost(ev.target.valueAsNumber)}
                />
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
                <p>{rupiahConverter(getSubTotal())}</p>
              </div>
              <div className="rincianSub">
                <h5>Diskon</h5>
                <p>-{rupiahConverter(getDiscount())}</p>
              </div>
              <div className="rincianSub">
                <h5>Pajak</h5>
                <p>+{rupiahConverter(getTaxes())}</p>
              </div>
              <div className="rincianSub">
                <h5>Biaya Tambahan</h5>
                <p>+{rupiahConverter(additionalCost)}</p>
              </div>
              <div className="rincianSubFinal">
                <h5>Total</h5>
                <p>{rupiahConverter(getSubTotal() - getDiscount() + getTaxes() + additionalCost)}</p>
              </div>
              <button>Tambah Pesanan</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderanNew;
