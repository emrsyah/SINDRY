import { Gender } from "@/dataStructure";
import React, { useState } from "react";
import { genderOptions } from "../../../../dataStructure";
import Select from "react-select";

const OrderanNew = () => {
  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0]
  );

  return (
    <div>
      <div className="outletTitle">
        <h2>Buat Pesanan Baru</h2>
      </div>
      <div className="oNewContainer">
        <div className="oNewL">
          <div className="cusSec">
            <h4 className="primaryC oSubTitle">Info Pelanggan</h4>
            <div className="oFormContainer">
              <div className="formSub">
                <h5>Nama</h5>
                <input type="text" required />
              </div>
              <div className="formSub">
                <h5>Kontak</h5>
                <input type="text" required />
              </div>
              <div className="formSub">
                <h5>Alamat</h5>
                <input type="text" required />
              </div>
              <div className="formSub">
                <h5>Gender</h5>
                {/* <input type="text" required /> */}
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
            </div>
          </div>

          <div className="cusSec">
            <div className="cusSecTitle">
              <h4 className="primaryC oSubTitle">Produk</h4>
              <button className="btnSecondary">Pilih Produk</button>
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
