import { useEffect } from "react";
import axios from "./../../untils/axios";
import "./Cart.css";
import { Input, Select, Radio } from "antd";
import { useState } from "react";

const CartProducts = () => {
  const [provine, SetProvine] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(1);
  const [warn, setWarn] = useState([]);
  const [id, SetId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(""); // State lưu quận/huyện đã chọn
  const [WarnDistrict, setSelectedWarnDistrict] = useState("");
  const DataProvine = async () => {
    try {
      let api = "https://esgoo.net/api-tinhthanh/1/0.htm";
      let res = await axios.get(api);
      if (res.data && res.data.data) {
        const dataProvines = res.data.data.map((data) => {
          return { id: data.id, name: data.name };
        });
        SetProvine(dataProvines);
      }
    } catch (error) {}
  };

  const DistrstData = async () => {
    try {
      let url = `https://esgoo.net/api-tinhthanh/2/${id}.htm`;
      let res = await axios.get(url);
      if (res.data && res.data.data) {
        const data = res.data.data.map((item) => {
          return { id: item.id, name: item.full_name };
        });
        setDistrict(data);
      }
    } catch (error) {}
  };
  const WarnData = async () => {
    try {
      let url = `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`;
      let res = await axios.get(url);
      if (res.data && res.data.data) {
        const data = res.data.data.map((item) => {
          return { id: item.id, name: item.full_name };
        });
        setWarn(data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    DataProvine();
  }, []);

  useEffect(() => {
    DistrstData();
  }, [id]);
  useEffect(() => {
    WarnData();
  }, [selectedDistrict]);

  const handleProvinceChange = (value) => {
    SetId(value);
    setDistrict([]); // Xóa các quận/huyện khi thay đổi tỉnh
    setSelectedDistrict("");
    setSelectedWarnDistrict("");
    setWarn([]); // Reset giá trị quận/huyện đã chọn
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div className="cart flex justify-between">
      <div className="w-1/2">
        <h1 className="text-3xl font-semibold">Thông tin đặt hàng</h1>
        <div className="mt-4 gap-4 flex items-center">
          <div className="w-2/3">
            <label className="text-sm">Họ và tên</label>
            <Input placeholder="Nhập họ và tên" />
          </div>
          <div className="w-1/3">
            <label className="text-sm">Số điện thoại</label>
            <Input placeholder="Nhập số điện thoại" />
          </div>
        </div>
        <div className="mt-2 ">
          <div className="">
            <label className="text-sm">Emai</label>
            <Input placeholder="Nhập email của bạn" />
          </div>
        </div>
        <div className="mt-2 ">
          <div className="">
            <label className="text-sm">Địa chỉ</label>
            <Input placeholder="Nhập địa chỉ của bạn" />
            <div className="mt-2">
              <div className="flex gap-2">
                <Select
                  placeholder="Chọn Tỉnh/Thành Phố"
                  style={{
                    flex: 1,
                  }}
                  // Đặt giá trị quận/huyện đã chọn
                  options={[
                    {
                      value: "",
                      label: "Chọn Tỉnh/Thành Phố",
                      disabled: true,
                    },
                    ...provine.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                  onChange={handleProvinceChange}
                />
                <Select
                  placeholder="Chọn Quận/Huyện"
                  style={{
                    flex: 1,
                  }}
                  value={selectedDistrict} // Đặt giá trị quận/huyện đã chọn
                  options={[
                    {
                      value: "",
                      label: "Chọn Quận/Huyện",
                      disabled: true,
                    },
                    ...district.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                  onChange={handleDistrictChange}
                />
                <Select
                  placeholder="Chọn Phường/Xã"
                  style={{
                    flex: 1,
                  }}
                  value={WarnDistrict}
                  options={[
                    {
                      value: "",
                      label: "Chọn Phường/Xã",
                      disabled: true,
                    },
                    ...warn.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                  onChange={(value) => {
                    setSelectedWarnDistrict(value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-semibold">Hình thức thanh toán</h1>
          <div className="mt-3">
            <Radio.Group onChange={onChange} value={value} className="w-full">
              <div className="h-50 pay">
                <Radio value={1}>
                  <div className="flex gap-3">
                    <img
                      src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                      alt="lõi"
                      className="w-11 h-full"
                    />
                    <div className="">
                      <p className="font-bold text-sm">
                        Thanh toán qua ZaloPay
                      </p>
                      <span className="flex w-full gap-3 text-[#737373]">
                        Hỗ trợ mọi hình thức thanh toán
                        <img
                          src="https://mcdn.coolmate.me/image/October2024/mceclip0_27.png"
                          alt="lỗi"
                          className="w-64"
                        />
                      </span>
                    </div>
                  </div>
                </Radio>
              </div>
              <div className="h-50 pay">
                <Radio value={2}>
                  <div className="flex gap-3 items-center">
                    <img
                      src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
                      alt="lõi"
                      className="w-11 h-full"
                    />

                    <p className="font-bold text-sm ">
                      Thanh toán khi nhận hàng
                    </p>
                  </div>
                </Radio>
              </div>
              <div className="h-50 pay">
                <Radio value={3}>
                  <div className="flex gap-3 items-center">
                    <img
                      src="https://mcdn.coolmate.me/image/October2024/mceclip1_171.png"
                      alt="lõi"
                      className="w-11 h-full"
                    />

                    <p className="font-bold text-sm ">Ví MoMo</p>
                  </div>
                </Radio>
              </div>
              <div className="h-50 pay">
                <Radio value={4}>
                  <div className="flex gap-3">
                    <img
                      src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                      alt="lõi"
                      className="w-11 h-full"
                    />
                    <div className="">
                      <p className="font-bold text-sm">Ví điện tủ VNPAY</p>
                      <span className="flex w-full gap-3 text-[#737373]">
                        Quét QZ để thanh toán
                      </span>
                    </div>
                  </div>
                </Radio>
              </div>
            </Radio.Group>
          </div>
        </div>
      </div>
      <div className="w-1/2">2</div>
    </div>
  );
};

export default CartProducts;
