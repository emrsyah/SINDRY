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
  Transaction,
  TransactionDetailType,
  CustomerListType,
  TransactionWithCustomer,
} from "@/dataStructure";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { generateRandomId } from "@/helpers/generateRandomId";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import {
  UilEditAlt,
  UilPrint,
  UilCheckCircle,
  UilTimesCircle,
} from "@iconscout/react-unicons";
import transactionStatusConverter from "@/helpers/transactionStatusConverter";

const OrderanDetail = () => {
  const { id } = useParams();
  const [customerD, setCustomerD] = useState<Customer>();
  // const [outlets, setOutlets] = useState<OutletListType>([]);
  // const [selectedOutlet, setSelectedOutlet] = useState<Outlet>();
  // const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [transactions, setTransactions] = useState<TransactionWithCustomer>();
  const [transactionItems, setTransactionItems] =
    useState<TransactionDetailType>([]);
  // const [customers, setCustomers] = useState<CustomerListType>([]);

  const { register, handleSubmit } = useForm<Customer>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // connectionSql.connect();
    const sqlSt = `SELECT * FROM customers WHERE id = ${id}`;
    var txnSt = `SELECT t.*, o.name AS outlet_name, u.name AS cashier_name, c.name AS customer_name, c.address AS customer_address, c.contact AS customer_contact FROM transactions t, outlets o, users u, customers c WHERE t.outlet_id = o.id AND t.cashier_id = u.id AND t.customer_id = c.id AND t.id = ${id}`;
    const txnDetailSt = `SELECT td.*, p.name, p.price, p.price * td.quantity AS 'total' FROM transaction_details td, products p WHERE td.transaction_id = ${id} AND td.product_id = p.id`;
    const outletSt = "SELECT name AS label, id, id AS value FROM outlets";
    // ! KASIR MASIH SEMUA, BELUM PER OUTLET
    const cashierSt =
      "SELECT name AS label, id, id AS value FROM users WHERE role IN ('admin', 'cashier')";
    const customerSt = `SELECT c.name AS label, c.id, c.id AS value FROM customers c, transactions t WHERE t.outlet_id = c.outlet_id AND t.id = ${id}`;
    // const produc
    connectionSql.query(
      `${sqlSt}; ${outletSt}; ${cashierSt}; ${txnSt}; ${txnDetailSt};  ${customerSt};`,
      (err, results, fields) => {
        if (err) console.error(err);
        else {
          // console.log(results)
          const dataReturn: Customer = results[0][0];
          const outletReturn = results[1];
          // const selected = outletReturn.filter(
          //   (obj: Outlet) => obj.id == dataReturn.outlet_id
          // )[0];
          // const genderSelected = genderOptions.filter(
          //   (obj: Gender) => obj.value == dataReturn.gender
          // )[0];
          // console.log(results[2])
          setTransactions(results[3][0]);
          console.log(results[3][0]);
          setTransactionItems(results[4]);
          // setCustomers(results[5]);
          setCustomerD(dataReturn);
          // setOutlets(outletReturn);
          // setSelectedOutlet(selected);
          // setSelectedGender(genderSelected);
          setLoading(false);
        }
      }
    );
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
        <div>
          <button>
            Edit
            <UilEditAlt />
          </button>
          <button className="btnSecondary">
            Cetak Struk <UilPrint />
          </button>
        </div>
      </div>

      <div className="detailHead">
        <div>
          <h3>#{transactions?.invoice_code}</h3>
          <p>{dayjs(transactions?.created_at).format("DD MMM YYYY")}</p>
        </div>
        <div className="detailHeadSub2">
          <p className="primaryC">{rupiahConverter(transactions!.total)}</p>
          <p
            className={`stat ${
              transactions?.status === "new"
                ? "lType"
                : transactions?.status === "on_process"
                ? "kType"
                : transactions?.status === "finished"
                ? "sType"
                : transactions?.status === "picked_up"
                ? "bcType"
                : ""
            }`}
          >
            {transactionStatusConverter(transactions!.status)}
          </p>
        </div>
      </div>

      <div className="detailBody">
        <div className="detailSub">
          <div className="detailSubH">
            <h5>Detail Pesanan</h5>
          </div>
          <div className="detailSubB">
            <p>Kode Pesanan</p>
            <h5>#{transactions?.invoice_code}</h5>
          </div>
          <div className="detailSubB">
            <p>Tanggal Pemesanan</p>
            <h5>{dayjs(transactions?.created_at).format("DD MMMM")}</h5>
          </div>
          <div className="detailSubB">
            <p>Status</p>
            <h5
              className={`${
                transactions?.status === "new"
                  ? "lType"
                  : transactions?.status === "on_process"
                  ? "kType"
                  : transactions?.status === "finished"
                  ? "sType"
                  : transactions?.status === "picked_up"
                  ? "bcType"
                  : ""
              }`}
            >
            {transactionStatusConverter(transactions!.status)}
            </h5>
          </div>
          <div className="detailSubB">
            <p>Pembayaran</p>
            <h5 className="paidStatus">
              {transactions?.is_paid === 1 ? (
                <>
                  <UilCheckCircle size="18" className="cIcon" />
                  <p>Dibayar</p>
                </>
              ) : (
                <>
                  <UilTimesCircle size="18" className="xIcon" />
                  <p>Belum</p>
                </>
              )}
            </h5>
          </div>
          <div className="detailSubB">
            <p>Outlet</p>
            <h5>{transactions?.outlet_name}</h5>
          </div>
          <div className="detailSubB">
            <p>Total</p>
            <h5>{rupiahConverter(transactions!.total)}</h5>
          </div>
        </div>

        <div className="detailSub2">
          <div className="detailSub">
            <div className="detailSubH">
              <h5>Detail Pelanggan</h5>
            </div>
            <div className="detailSubB">
              <p>Nama</p>
              <h5>{transactions?.customer_name}</h5>
            </div>
            <div className="detailSubB">
              <p>Alamat</p>
              <h5>{transactions?.customer_address}</h5>
            </div>
            <div className="detailSubB">
              <p>Kontak</p>
              <h5>{transactions?.customer_contact}</h5>
            </div>
          </div>
          <div className="detailSub">
            <div className="detailSubH">
              <h5>Detail Kasir</h5>
            </div>
            <div className="detailSubB">
              <p>Nama Kasir</p>
              <h5>{transactions?.cashier_name}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="detailItems">
        <div className="detailSubH">
          <h5>Ringkasan Pesanan</h5>
        </div>
        {transactionItems.map((d, i) => (
          <div className="detailItem" key={d.id}>
            {/* <img src="" alt="" /> */}
            <h5 className="productN">
              <div className="productLogo">{d.name.substring(0, 2)}</div>
              {d.name}
            </h5>
            <h5 className="productQ">x{d.quantity}</h5>
            <h5 className="productT">{rupiahConverter(d!.total)}</h5>
            {/* <h5 className="productT">{rupiahConverter(d!.description)}</h5> */}
          </div>
        ))}
        <div className="detailFinal">
          <div className="detailSubB detailFinalSub">
            <p>Sub Total</p>
            <h5>{rupiahConverter(transactions!.sub_total)}</h5>
          </div>
          <div className="detailSubB detailFinalSub">
            <p>Diskon</p>
            <h5>{transactions?.discount}%</h5>
          </div>
          <div className="detailSubB detailFinalSub">
            <p>Pajak</p>
            <h5>{transactions?.taxes}%</h5>
          </div>
          <div className="detailSubB detailFinalSub lastTotal">
            <p>Total Akhir</p>
            <h5 className="primaryC">{rupiahConverter(transactions!.total)}</h5>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OrderanDetail;

// <div className="formContainerDetail">
// <div className="formSub">
//   <h5>Nama</h5>
//   <input
//     type="text"
//     defaultValue={customerD?.name}
//     required
//     {...register("name")}
//   />
// </div>
// <div className="formSub">
//   <h5>Contact</h5>
//   <input
//     type="text"
//     defaultValue={customerD?.contact}
//     {...register("contact")}
//   />
// </div>
// <div className="formSub">
//   <h5>Gender</h5>
//   {/* <textarea name="" id=""></textarea> */}
//   <Select
//     options={genderOptions}
//     value={selectedGender}
//     className="selectInput"
//     onChange={setSelectedGender}
//     theme={(theme) => ({
//       ...theme,
//       colors: {
//         ...theme.colors,
//         primary25: "#646cff",
//         primary: "white",
//         neutral80: "white",
//         neutral0: "#323232",
//       },
//     })}
//   />
// </div>
// <div className="formSub">
//   <h5>Outlet</h5>
//   <Select
//     options={outlets}
//     value={selectedOutlet}
//     className="selectInput"
//     onChange={setSelectedOutlet}
//     theme={(theme) => ({
//       ...theme,
//       colors: {
//         ...theme.colors,
//         primary25: "#646cff",
//         primary: "white",
//         neutral80: "white",
//         neutral0: "#323232",
//       },
//     })}
//   />
// </div>

// <div className="formSub">
//   <h5>Alamat</h5>
//   {/* <textarea name="" id=""></textarea> */}
//   <input
//     type="text"
//     defaultValue={customerD?.address}
//     {...register("address")}
//   />
// </div>

// <div className="formSub disabledInput">
//   <h5>Ditambahkan Pada</h5>
//   <input
//     type="text"
//     disabled
//     value={dayjs(customerD?.created_at).format("DD MMM YYYY")}
//   />
// </div>
// </div>
