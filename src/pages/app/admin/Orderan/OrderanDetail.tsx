import { connectionSql } from "@/sqlConnect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/adminDetail.scss";
import { Customer, OutletListType, Outlet, genderOptions, Gender, Transaction, TransactionDetailType, CustomerListType } from "@/dataStructure";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { generateRandomId } from "@/helpers/generateRandomId";

const OrderanDetail = () => {
  const { id } = useParams();
  const [customerD, setCustomerD] = useState<Customer>();
  const [outlets, setOutlets] = useState<OutletListType>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [transactions, setTransactions] = useState<Transaction>()
  const [transactionItems, setTransactionItems] = useState<TransactionDetailType>([])
  const [customers, setCustomers] = useState<CustomerListType>([])

  const { register, handleSubmit } = useForm<Customer>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // connectionSql.connect();
    console.log(generateRandomId(8))
    const sqlSt = `SELECT * FROM customers WHERE id = ${id}`;
    const txnSt = `SELECT * FROM transactions WHERE id = ${id}`;
    const txnDetailSt = `SELECT td.*, p.name, p.price, p.price * td.quantity AS 'total' FROM transaction_details td, products p WHERE td.transaction_id = ${id} AND td.product_id = p.id`;
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    // ! KASIR MASIH SEMUA, BELUM PER OUTLET
    const cashierSt = "SELECT name AS label, id, id AS value FROM users WHERE role IN ('admin', 'cashier')"
    const customerSt = `SELECT c.name AS label, c.id, c.id AS value FROM customers c, transactions t WHERE t.outlet_id = c.outlet_id AND t.id = ${id}`
    // const produc
    connectionSql.query(`${sqlSt}; ${outletSt}; ${cashierSt}; ${txnSt}; ${txnDetailSt};  ${customerSt};`, (err, results, fields) => {
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
        // console.log(results[2])
        setTransactions(results[3][0])
        console.log(results[3][0])
        setTransactionItems(results[4])
        setCustomers(results[5])
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
        <h2>Detail Orderan</h2>
        <button>Simpan Perubahan</button>
      </div>
      <div className="detailHead">
        <h3>#z1SLSKCV</h3>
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

export default OrderanDetail;
