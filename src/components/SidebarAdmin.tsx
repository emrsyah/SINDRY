import logo from "../assets/sindryLogos.svg";
import {
  UilEstate,
  UilClipboardNotes,
  UilTagAlt,
  UilUserSquare,
  UilStoreAlt,
  UilPlus,
  UilUsersAlt ,
} from "@iconscout/react-unicons";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    path: "/app/a/beranda",
    name: "Beranda",
  },
  {
    path: "/app/a/orderan",
    name: "Orderan",
  },
  {
    path: "/app/a/produk",
    name: "Produk",
  },
  {
    path: "/app/a/pelanggan",
    name: "Pelanggan",
  },
  {
    path: "/app/a/outlet",
    name: "Outlet",
  },
  // {
  //   path: "/app/a/pengguna",
  //   name: "Users",
  // },
];

const sidebarItemsAdmin = [
  {
    path: "/app/a/pengguna",
    name: "Pengguna",
  },
];

const getSidebarIcon = (name: string) => {
  if (name == "Beranda") return <UilEstate />;
  else if (name == "Orderan") return <UilClipboardNotes />;
  else if (name == "Produk") return <UilTagAlt />;
  else if (name == "Pelanggan") return <UilUserSquare />;
  else if (name == "Outlet") return <UilStoreAlt />;
  else if (name == "Pengguna") return <UilUsersAlt  />;
};

const SidebarAdmin = () => {
  const location = useLocation();
  console.log(location.pathname);

  const extractLocation = () => {
    const ar = location.pathname.split("/");
    if (ar[3] === "beranda") return "Beranda";
    else if (ar[3] === "orderan") return "Orderan";
    else if (ar[3] === "produk") return "Produk";
    else if (ar[3] === "pelanggan") return "Pelanggan";
    else if (ar[3] === "outlet") return "Outlet";
    else if (ar[3] === "pengguna") return "Pengguna";
  };

  return (
    <nav className="sidebarContainer">
      <div className="sidebarHead">
        <img src={logo} alt="" />
        <h4>SINDRY</h4>
      </div>
      <button>
        Tambah Transaksi
        <UilPlus />
      </button>
      {/* Button Transaksi Disini */}
      <div className="sidebarList">
        {sidebarItems.map((item, i) => (
          <Link to={item.path} className={`sidebarItem ${extractLocation() === item.name ? "sidebarItemActive" : ""}`} key={i}>
            {getSidebarIcon(item.name)}
            <p>{item.name}</p>
          </Link>
        ))}
        <div className="dividerSidebar"></div>
        {sidebarItemsAdmin.map((item, i) => (
          <Link to={item.path} className={`sidebarItem ${extractLocation() === item.name ? "sidebarItemActive" : ""}`} key={i}>
            {getSidebarIcon(item.name)}
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SidebarAdmin;
