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
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Product } from "../../../../dataStructure";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { UilTrashAlt } from "@iconscout/react-unicons";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatter";
import { generateRandomId } from "../../../../helpers/generateRandomId";

interface AddedProductProps extends Product {
  quantity: number;
}

interface OrderanNewProps extends Customer, Transaction {}

const paidStatusOptions = [
  { value: 0, label: "Belum Dibayar" },
  { value: 1, label: "Sudah Dibayar" },
];

const transactionStatusOptions = [
  { value: "new", label: "Baru" },
  { value: "on_process", label: "Diproses" },
  { value: "finished", label: "Selesai" },
  { value: "picked_up", label: "Diambil" },
];

const OrderanNew = () => {
  const nav = useNavigate()
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  const { register, handleSubmit, getValues, setValue } =
    useForm<OrderanNewProps>();

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
  const [taxes, setTaxes] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [selectedPaidStat, setSelectedPaidStat] = useState(
    paidStatusOptions[0]
  );
  const [selectedTransactionStat, setSelectedTransactionStat] = useState(
    transactionStatusOptions[0]
  );

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
    return (getSubTotal() * discount) / 100;
  };

  const getTaxes = (): number => {
    return ((getSubTotal() - getDiscount()) * taxes) / 100;
  };

  const changeCustomerHandler = (data: Customer) => {
    console.log(selectedCustomer);
    if (data == null) {
      console.log("ini hapus");
      setValue("name", "");
      setValue("contact", "");
      setValue("address", "");
      setValue("id", -1);
      setSelectedGender(genderOptions[0]);
      setSelectedCustomer(null);
    } else {
      setValue("name", data.name);
      setValue("contact", data.contact);
      setValue("address", data.address);
      setValue("id", data.id);
      const selectedGender = genderOptions.filter(
        (g) => g.value == data.gender
      );
      setSelectedGender(selectedGender[0]);
      setSelectedCustomer(data);
    }
    nav("/app/a/orderan")
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

  const submitHandler = handleSubmit(async (data) => {
    let cusId = data.id;
    let txnId = -1;
    const randomId = generateRandomId(8);
    const invoiceCode = `ID-${randomId}`;
    const subTotal = getSubTotal();
    const totalFinal = subTotal - getDiscount() + getTaxes() + additionalCost;

    // Add Customer If New
    if (selectedCustomer === null) {
      const addCusSql = `INSERT INTO customers (id, name, address, gender, contact, outlet_id, created_at) VALUES (NULL, '${
        data.name
      }', '${data.address}', '${selectedGender.value}', '${
        data.contact
      }', '${params.get("oid")}', current_timestamp())`;
      console.log(addCusSql);
      connectionSql.query(addCusSql, (err, results, fields) => {
        if (err) console.error(err);
        else {
          // console.log(results)
          // console.log(results.insertId)
          cusId = results.insertId;
          let tmpId = results.insertId;

          // Add Transaction
          const addTxnSql = `INSERT INTO transactions (id, customer_id, created_at, total, sub_total, cashier_id, invoice_code, outlet_id, additional_cost, discount, taxes, status, is_paid, deadline, paid_at) VALUES (NULL, '${tmpId}', current_timestamp(), '${totalFinal}', '${subTotal}', '2', '${invoiceCode}', '${params.get(
            "oid"
          )}', '${additionalCost}', '${discount}', '${taxes}', '${
            selectedTransactionStat.value
          }', '${
            selectedPaidStat.value
          }', 'current_timestamp()', 'current_timestamp()')`;
          console.log(addTxnSql);
          connectionSql.query(addTxnSql, (err, results, fields) => {
            if (err) console.error(err);
            else {
              console.log(results);
              txnId = results.insertId;
              let tmpId = results.insertId;
              // Add Transaction Detail
              const arrTxnDetSt = addedProducts.map((d, i) => {
                return `INSERT INTO transaction_details (id, transaction_id, product_id, quantity, description) VALUES (NULL, '${tmpId}', '${d.id}', '${d.quantity}', '')`;
              });
              const combinedTxnSt = arrTxnDetSt.join("; ");
              console.log(arrTxnDetSt);
              connectionSql.query(combinedTxnSt, (err, results, fields) => {
                if (err) console.error(err);
                else {
                  console.log(results);
                }
              });
            }
          });
        }
      });
    } else {
      const addTxnSql = `INSERT INTO transactions (id, customer_id, created_at, total, sub_total, cashier_id, invoice_code, outlet_id, additional_cost, discount, taxes, status, is_paid, deadline, paid_at) VALUES (NULL, '${
        selectedCustomer.id
      }', current_timestamp(), '${totalFinal}', '${subTotal}', '2', '${invoiceCode}', '${params.get(
        "oid"
      )}', '${additionalCost}', '${discount}', '${taxes}', '${
        selectedTransactionStat.value
      }', '${
        selectedPaidStat.value
      }', 'current_timestamp()', 'current_timestamp()')`;
      console.log(addTxnSql);
      connectionSql.query(addTxnSql, (err, results, fields) => {
        if (err) console.error(err);
        else {
          console.log(results);
          let tmpId = results.insertId;
          console.log(tmpId);
          txnId = results.insertId;
          // Add Transaction Detail
          const arrTxnDetSt = addedProducts.map((d, i) => {
            return `INSERT INTO transaction_details (id, transaction_id, product_id, quantity, description) VALUES (NULL, '${tmpId}', '${d.id}', '${d.quantity}', '')`;
          });
          const combinedTxnSt = arrTxnDetSt.join("; ");
          console.log(arrTxnDetSt);
          connectionSql.query(combinedTxnSt, (err, results, fields) => {
            if (err) console.error(err);
            else {
              console.log(results);
            }
          });
        }
      });
    }

    // console.log(arrTxnDetSt);
    // console.log(data);
    // console.log(addedProducts);
    // console.log({
    //   discount,
    //   taxes,
    //   additionalCost,
    //   selectedPaidStat,
    //   selectedTransactionStat,
    // });
    // const addTxnSql = ''
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
                        type="button"
                        disabled={d.quantity < 2}
                        onClick={() => quantityChangeHandler(-1, d.id)}
                      >
                        -
                      </button>
                      <p>{d.quantity}</p>
                      <button
                        type="button"
                        onClick={() => quantityChangeHandler(1, d.id)}
                      >
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
                  onChange={(ev) => {
                    Number.isNaN(ev.target.valueAsNumber)
                      ? setDiscount(0)
                      : setDiscount(ev.target.valueAsNumber);
                  }}
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
                  onChange={(ev) => {
                    Number.isNaN(ev.target.valueAsNumber)
                      ? setTaxes(0)
                      : setTaxes(ev.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="formSub">
                <h5>Biaya Tambahan</h5>
                <input
                  type="number"
                  defaultValue={0}
                  // onKeyUp={(ev) => inputRupiahFormatted(ev.target)}
                  value={additionalCost}
                  onChange={(ev) => {
                    Number.isNaN(ev.target.valueAsNumber)
                      ? setAdditionalCost(0)
                      : setAdditionalCost(ev.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="formSub">
                <h5>Status</h5>
                {/* <input type="text" required /> */}
                <Select
                  options={transactionStatusOptions}
                  value={selectedTransactionStat}
                  className="selectInput"
                  onChange={setSelectedTransactionStat}
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
                <p>
                  {rupiahConverter(
                    getSubTotal() - getDiscount() + getTaxes() + additionalCost
                  )}
                </p>
              </div>
              <Select
                options={paidStatusOptions}
                value={selectedPaidStat}
                className="selectInput"
                onChange={setSelectedPaidStat}
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
              <button>Tambah Pesanan</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderanNew;
