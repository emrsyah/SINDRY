import logo from "../assets/sindryLogos.svg";
import {
  UilEstate,
  UilClipboardNotes,
  UilTagAlt,
  UilUserSquare,
  UilStoreAlt,
  UilPlus,
} from "@iconscout/react-unicons";
import { useLocation } from "react-router-dom";

const sidebarItems = [
  {
    path: "/app/beranda",
    name: "Beranda",
  },
  {
    path: "/app/pesanan",
    name: "Orderan",
  },
  {
    path: "/app/produk",
    name: "Produk",
  },
  {
    path: "/app/pelanggan",
    name: "Pelanggan",
  },
  {
    path: "/app/outlet",
    name: "Outlet",
  },
];

const sidebarItemsAdmin = [
  {
    path: "/app/pengguna",
    name: "Pengguna",
  },
];

const getSidebarIcon = (name: string) => {
  if (name == "Beranda") return <UilEstate />;
  else if (name == "Orderan") return <UilClipboardNotes />;
  else if (name == "Produk") return <UilTagAlt />;
  else if (name == "Pelanggan") return <UilUserSquare />;
  else if (name == "Outlet") return <UilStoreAlt />;
  else if (name == "Pengguna") return <UilEstate />;
};

const SidebarAdmin = () => {
  const location = useLocation();
  console.log(location.pathname);

  const extractLocation = () => {
    const ar = location.pathname.split("/");
    if (ar[3] === "beranda") return "Beranda";
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
          <div className={`sidebarItem ${extractLocation() === item.name ? "sidebarItemActive" : ""}`} key={i}>
            {getSidebarIcon(item.name)}
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SidebarAdmin;
