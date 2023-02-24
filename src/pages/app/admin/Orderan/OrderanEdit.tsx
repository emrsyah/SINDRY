import { Customer, Gender } from "@/dataStructure";
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
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Product } from "../../../../dataStructure";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import { UilTrashAlt } from "@iconscout/react-unicons";

interface AddedProductProps extends Product {
  quantity: number;
  product_id?: number;
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

const OrderanEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  const { register, handleSubmit, getValues, setValue } =
    useForm<OrderanNewProps>();

  const [transactions, setTransactions] = useState<Transaction>();
  const [originalproducts, setOriginalProducts] = useState<ProductListType>([]);
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
    const txnSt = `SELECT t.*, o.name AS outlet_name, u.name AS cashier_name, c.name AS customer_name, c.address AS customer_address, c.contact AS customer_contact FROM transactions t, outlets o, users u, customers c WHERE t.outlet_id = o.id AND t.cashier_id = u.id AND t.customer_id = c.id AND t.id = ${id}`;
    const txnDetailSt = `SELECT td.*, p.name, p.price, p.price * td.quantity AS 'total' FROM transaction_details td, products p WHERE td.transaction_id = ${id} AND td.product_id = p.id`;
    const cusSql = `SELECT c.*, c.id AS value, c.name AS label FROM customers c, transactions t WHERE t.id = '${id}' AND c.outlet_id = t.outlet_id`;
    const prdSql = `SELECT p.*, p.id AS value, p.name AS label FROM products p, transactions t WHERE t.id = '${id}' AND p.outlet_id = t.outlet_id`;
    const allSql = `${txnSt}; ${txnDetailSt}; ${cusSql}; ${prdSql}`;
    connectionSql.query(allSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        // Set Transaction Related Data
        const txnData: Transaction = results[0][0];
        setTransactions(txnData);
        setDiscount(txnData.discount);
        setTaxes(txnData.taxes);
        setAdditionalCost(txnData.additional_cost);

        const txnSelectedStat = transactionStatusOptions.find(
          (st) => st.value === txnData.status
        );
        setSelectedTransactionStat(txnSelectedStat!);

        const txnSelectedPaidStat = paidStatusOptions.find(
          (st) => st.value === txnData.is_paid
        );
        setSelectedPaidStat(txnSelectedPaidStat!);

        // Set Transaction Detail Related Data
        const txnDetailData: AddedProductProps[] = results[1];
        setAddedProducts(txnDetailData);
        setOriginalProducts(txnDetailData);

        console.log(txnDetailData);

        const selectedProductIds = txnDetailData.map((p) => p.product_id);
        const outletProduct: ProductListType = results[3];
        const notSelectedProduct = outletProduct.filter(
          (p) => !selectedProductIds.includes(p.id)
        );
        setFilteredProducts(notSelectedProduct);

        // Set Customer Related Data
        const outletCustomer: CustomerListType = results[2];
        setCustomers(outletCustomer);

        const selectedCustomer = outletCustomer.find(
          (c) => c.id === txnData.customer_id
        );
        setValue("name", selectedCustomer!.name);
        setValue("contact", selectedCustomer!.contact);
        setValue("address", selectedCustomer!.address);
        setValue("id", selectedCustomer!.id);
        const selectedGender = genderOptions.find(
          (g) => g.value == selectedCustomer!.gender
        );
        setSelectedGender(selectedGender!);
        setSelectedCustomer(selectedCustomer!);

        // console.log(txnDetailData)
        // console.log(results);

        // console.log(results[1][0]);
        // setSelectedOutlet(results[0][0]);
        // setCustomers(results[1]);
        // setProducts(results[2]);
        // setFilteredProducts(results[2]);F
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
    setValue("name", data.name);
    setValue("contact", data.contact);
    setValue("address", data.address);
    setValue("id", data.id);
    const selectedGender = genderOptions.filter((g) => g.value == data.gender);
    setSelectedGender(selectedGender[0]);
    setSelectedCustomer(data);
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
    const newSelectedProduct = addedProducts;
    const subTotal = getSubTotal();
    const totalFinal = subTotal - getDiscount() + getTaxes() + additionalCost;

    // Find All Product That Need To Be Update (Same Transaction Detail)
    const toSetProduct = newSelectedProduct.filter(
      (p) => typeof p.product_id === "number"
    );
    const toSetProductIds = toSetProduct.map((p) => p.id);

    // Find All Product That Need To Be Add (New Transacation Detail)
    const toAddProduct = newSelectedProduct.filter(
      (p) => typeof p.product_id !== "number"
    );

    // Find All Product That Need To Be Deleted (Delete Transacation Detail)
    const toDeleteProduct = originalproducts.filter(
      (p) => !toSetProductIds.includes(p.id)
    );

    console.log(transactions);
    console.log(selectedPaidStat.value);

    const paidAt =
      selectedPaidStat.value == 0
        ? transactions?.paid_at
        : selectedPaidStat.value == transactions?.is_paid
        ? transactions.paid_at
        : new Date().toISOString().slice(0, 19).replace("T", " ");

    const updTxnSql = `UPDATE transactions
                     SET customer_id = '${selectedCustomer?.id}', discount = '${discount}', taxes = '${taxes}', additional_cost = '${additionalCost}', status = '${selectedTransactionStat.value}', sub_total = '${subTotal}', total = '${totalFinal}', is_paid = '${selectedPaidStat.value}', paid_at = '${paidAt}'
                     WHERE id = ${id}`;

    connectionSql.query(updTxnSql, (err, results, fields) => {
      if (err) console.error(err);
      else {
        console.log(results);
      }
    });

    // // Add Customer If New
    // if (selectedCustomer === null) {
    //   const addCusSql = `INSERT INTO customers (id, name, address, gender, contact, outlet_id, created_at) VALUES (NULL, '${data.name}', '${data.address}', '${selectedGender.value}', '${data.contact}', '${id}', current_timestamp())`;
    //   console.log(addCusSql);
    //   connectionSql.query(addCusSql, (err, results, fields) => {
    //     if (err) console.error(err);
    //     else {
    //       // console.log(results)
    //       // console.log(results.insertId)
    //       cusId = results.insertId;
    //       let tmpId = results.insertId;

    //       // Add Transaction
    //       const addTxnSql = `INSERT INTO transactions (id, customer_id, created_at, total, sub_total, cashier_id, invoice_code, outlet_id, additional_cost, discount, taxes, status, is_paid, deadline, paid_at) VALUES (NULL, '${tmpId}', current_timestamp(), '${totalFinal}', '${subTotal}', '2', '${invoiceCode}', '${params.get(
    //         "oid"
    //       )}', '${additionalCost}', '${discount}', '${taxes}', '${
    //         selectedTransactionStat.value
    //       }', '${
    //         selectedPaidStat.value
    //       }', 'current_timestamp()', 'current_timestamp()')`;
    //       console.log(addTxnSql);
    //       connectionSql.query(addTxnSql, (err, results, fields) => {
    //         if (err) console.error(err);
    //         else {
    //           console.log(results);
    //           txnId = results.insertId;
    //           let tmpId = results.insertId;
    //           // Add Transaction Detail
    //           const arrTxnDetSt = addedProducts.map((d, i) => {
    //             return `INSERT INTO transaction_details (id, transaction_id, product_id, quantity, description) VALUES (NULL, '${tmpId}', '${d.id}', '${d.quantity}', '')`;
    //           });
    //           const combinedTxnSt = arrTxnDetSt.join("; ");
    //           console.log(arrTxnDetSt);
    //           connectionSql.query(combinedTxnSt, (err, results, fields) => {
    //             if (err) console.error(err);
    //             else {
    //               console.log(results);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   const addTxnSql = `INSERT INTO transactions (id, customer_id, created_at, total, sub_total, cashier_id, invoice_code, outlet_id, additional_cost, discount, taxes, status, is_paid, deadline, paid_at) VALUES (NULL, '${
    //     selectedCustomer.id
    //   }', current_timestamp(), '${totalFinal}', '${subTotal}', '2', '${invoiceCode}', '${params.get(
    //     "oid"
    //   )}', '${additionalCost}', '${discount}', '${taxes}', '${
    //     selectedTransactionStat.value
    //   }', '${
    //     selectedPaidStat.value
    //   }', 'current_timestamp()', 'current_timestamp()')`;
    //   console.log(addTxnSql);
    //   connectionSql.query(addTxnSql, (err, results, fields) => {
    //     if (err) console.error(err);
    //     else {
    //       console.log(results);
    //       let tmpId = results.insertId;
    //       console.log(tmpId);
    //       txnId = results.insertId;
    //       // Add Transaction Detail
    //       const arrTxnDetSt = addedProducts.map((d, i) => {
    //         return `INSERT INTO transaction_details (id, transaction_id, product_id, quantity, description) VALUES (NULL, '${tmpId}', '${d.id}', '${d.quantity}', '')`;
    //       });
    //       const combinedTxnSt = arrTxnDetSt.join("; ");
    //       console.log(arrTxnDetSt);
    //       connectionSql.query(combinedTxnSt, (err, results, fields) => {
    //         if (err) console.error(err);
    //         else {
    //           console.log(results);
    //         }
    //       });
    //     }
    //   });
    // }
    // nav("/app/a/orderan");
  });

  return (
    <div>
      <div className="outletTitle">
        <h2>Edit Pesanan | {transactions?.invoice_code}</h2>
        <p>Outlet {transactions?.outlet_name}</p>
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
              <button>Ubah Pesanan</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderanEdit;
